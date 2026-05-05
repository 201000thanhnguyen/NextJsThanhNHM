'use client';

import { useState } from 'react';
import { ImageItem as ImageItemType } from '../types';
import { apiUrl } from '@/lib/api';

type Props = {
  image: ImageItemType;
  onEdit: (img: ImageItemType) => void;
  onShow: (img: ImageItemType) => void;
  onDelete: (img: ImageItemType) => Promise<void>;
  deleting?: boolean;
};

export default function ImageItem({ image, onEdit, onShow, onDelete, deleting }: Props) {
  const [err, setErr] = useState<string | null>(null);

  async function handleDelete() {
    if (!confirm(`Delete "${image.name}"?`)) return;
    setErr(null);
    try {
      await onDelete(image);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Delete failed');
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
      <button className="w-full" onClick={() => onShow(image)} disabled={deleting}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={apiUrl(image.url)}
          alt={image.name}
          className="h-40 w-full rounded-lg bg-gray-50 object-cover"
          loading="lazy"
        />
      </button>
      <div className="mt-2 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate text-sm font-medium">{image.name}</div>
          <div className="text-xs text-gray-500">{new Date(image.createdAt).toLocaleString()}</div>
        </div>
      </div>

      {err ? <div className="mt-2 rounded-md bg-red-50 p-2 text-xs text-red-700">{err}</div> : null}

      <div className="mt-3 grid grid-cols-3 gap-2">
        <button
          className="rounded-md border border-gray-300 px-2 py-2 text-xs hover:bg-gray-50 disabled:opacity-50"
          onClick={() => onShow(image)}
          disabled={deleting}
        >
          Show
        </button>
        <button
          className="rounded-md border border-gray-300 px-2 py-2 text-xs hover:bg-gray-50 disabled:opacity-50"
          onClick={() => onEdit(image)}
          disabled={deleting}
        >
          Edit
        </button>
        <button
          className="rounded-md border border-red-300 bg-red-50 px-2 py-2 text-xs text-red-700 hover:bg-red-100 disabled:opacity-50"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </div>
  );
}

