// Supabase Edge Function: stripe-webhook
// Follows Deno runtime for Supabase Edge Functions.
// Handles checkout.session.completed, customer.subscription.updated, customer.subscription.deleted
// Securely updates the 'subscriptions' table via service_role client.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.14.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const stripe = new Stripe(Deno.env.get("STRIPE_API_KEY") || Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

const cryptoProvider = Stripe.createSubtleCryptoProvider();

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function findUserIdByEmail(email: string): Promise<string | undefined> {
  const clean = email.toLowerCase().trim();
  if (!clean) return undefined;

  const { data: rpcId, error: rpcErr } = await supabaseAdmin.rpc("get_user_id_by_email", {
    target_email: clean,
  });
  if (!rpcErr && rpcId) {
    return String(rpcId);
  }

  let page = 1;
  while (page <= 10) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error || !data?.users?.length) break;
    const matched = data.users.find((u) => u.email?.toLowerCase().trim() === clean);
    if (matched) return matched.id;
    if (data.users.length < 1000) break;
    page++;
  }
  return undefined;
}

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  const body = await req.text();
  let event: Stripe.Event;

  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret,
      undefined,
      cryptoProvider
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return new Response(`Webhook signature verification failed: ${err.message}`, { status: 400 });
  }

  console.log(`Processing Stripe event: ${event.type} [${event.id}]`);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerEmail = session.customer_details?.email || session.customer_email || "";
        const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id || "";
        const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id || "";

        let userId = session.client_reference_id || undefined;

        if (!userId && customerEmail) {
          userId = await findUserIdByEmail(customerEmail);
        }

        let status = "active";
        let periodEnd = new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString();

        if (subscriptionId) {
          try {
            const sub = await stripe.subscriptions.retrieve(subscriptionId);
            status = sub.status;
            periodEnd = new Date(sub.current_period_end * 1000).toISOString();
          } catch (e: any) {
            console.error("Could not retrieve subscription details from Stripe:", e.message);
          }
        }

        if (userId) {
          const { error: upsertErr } = await supabaseAdmin
            .from("subscriptions")
            .upsert({
              user_id: userId,
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              status: status,
              current_period_end: periodEnd,
              updated_at: new Date().toISOString(),
            }, { onConflict: "user_id" });

          if (upsertErr) {
            console.error("Error upserting subscription for user:", upsertErr);
          } else {
            console.log(`Subscription activated successfully for user ${userId}`);
          }
        } else {
          console.warn(`Could not resolve Supabase user for customer email: ${customerEmail}`);
        }
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer?.id || "";
        const subscriptionId = sub.id;
        const status = sub.status;
        const periodEnd = new Date(sub.current_period_end * 1000).toISOString();

        const { data: existing } = await supabaseAdmin
          .from("subscriptions")
          .select("user_id")
          .or(`stripe_subscription_id.eq.${subscriptionId},stripe_customer_id.eq.${customerId}`)
          .maybeSingle();

        let userId = existing?.user_id;

        if (!userId && customerId) {
          try {
            const customer = await stripe.customers.retrieve(customerId);
            if (!customer.deleted && customer.email) {
              userId = await findUserIdByEmail(customer.email);
            }
          } catch (e: any) {
            console.error("Error retrieving customer from Stripe:", e.message);
          }
        }

        if (userId) {
          const { error: updateErr } = await supabaseAdmin
            .from("subscriptions")
            .upsert({
              user_id: userId,
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              status: status,
              current_period_end: periodEnd,
              updated_at: new Date().toISOString(),
            }, { onConflict: "user_id" });

          if (updateErr) {
            console.error("Error updating subscription:", updateErr);
          } else {
            console.log(`Subscription updated for user ${userId}: status=${status}`);
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer?.id || "";
        const subscriptionId = sub.id;

        const { error: delErr } = await supabaseAdmin
          .from("subscriptions")
          .update({
            status: "canceled",
            updated_at: new Date().toISOString(),
          })
          .or(`stripe_subscription_id.eq.${subscriptionId},stripe_customer_id.eq.${customerId}`);

        if (delErr) {
          console.error("Error marking subscription canceled:", delErr);
        } else {
          console.log(`Subscription marked canceled for sub ${subscriptionId}`);
        }
        break;
      }

      default:
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Internal webhook error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
