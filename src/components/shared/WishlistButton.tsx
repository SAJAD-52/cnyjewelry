import React from 'react';
import { useApp } from '../../context/AppContext';

interface WishlistButtonProps {
  id: string;
  label: string;
  note?: string;
}

export const WishlistButton: React.FC<WishlistButtonProps> = ({ id, label, note }) => {
  const { hasWishlist, toggleWishlist } = useApp();
  const saved = hasWishlist(id);

  return (
    <button
      className="save"
      aria-pressed={saved}
      onClick={() => toggleWishlist({ id, label, note })}
      title={saved ? 'Remove from Wishlist' : 'Save to Wishlist'}
    >
      {saved ? '♥ Saved' : '♡ Save'}
    </button>
  );
};
