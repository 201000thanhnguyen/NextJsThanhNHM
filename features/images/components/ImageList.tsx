'use client';

import ImageItem from './ImageItem';
import { ImageItem as ImageItemType } from '../types';

type Props = {
  items: ImageItemType[];
  deletingId?: string | null;
  onEdit: (img: ImageItemType) => void;
  onShow: (img: ImageItemType) => void;
  onDelete: (img: ImageItemType) => Promise<void>;
};

export default function ImageList({ items, deletingId, onEdit, onShow, onDelete }: Props) {
  if (items.length === 0) {
    return <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-600">No images yet.</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map(img => (
        <ImageItem
          key={img.id}
          image={img}
          onEdit={onEdit}
          onShow={onShow}
          onDelete={onDelete}
          deleting={deletingId === img.id}
        />
      ))}
    </div>
  );
}

