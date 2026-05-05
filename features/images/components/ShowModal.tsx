'use client';

import { ImageItem } from '../types';
import { apiUrl } from '@/lib/api';

type Props = {
  open: boolean;
  image: ImageItem | null;
  onClose: () => void;
};

export default function ShowModal({ open, image, onClose }: Props) {
  if (!open || !image) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="w-full max-w-4xl rounded-xl bg-white p-4 shadow-lg" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between gap-3">
          <div className="text-lg font-semibold">{image.name}</div>
          <button className="rounded-md px-2 py-1 text-sm hover:bg-gray-100" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="mt-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="max-h-[75vh] w-full rounded bg-gray-50 object-contain" src={apiUrl(image.url)} alt={image.name} />
        </div>
      </div>
    </div>
  );
}

