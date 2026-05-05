'use client';

import { useEffect, useMemo, useState } from 'react';
import { ImageItem } from '../types';
import { apiUrl } from '@/lib/api';
import { patchImageForm, patchImageJson } from '../api/api';

type Props = {
  open: boolean;
  image: ImageItem | null;
  onClose: () => void;
  onUpdated: (img: ImageItem) => void;
};

export default function EditModal({ open, image, onClose, onUpdated }: Props) {
  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !image) return;
    setName(image.name ?? '');
    setFile(null);
    setError(null);
  }, [open, image]);

  const previewUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (!open || !image) return null;

  async function onSubmit() {
    const current = image;
    if (!current) return;

    setSaving(true);
    setError(null);
    try {
      const trimmed = name.trim();
      const nameChanged = trimmed !== current.name;
      const nextName = trimmed.length ? trimmed : 'Untitled';

      const updated = file
        ? await patchImageForm(current.id, { name: nextName, file })
        : nameChanged
          ? await patchImageJson(current.id, { name: nextName })
          : current;

      onUpdated(updated);
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Update failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-4 shadow-lg">
        <div className="flex items-center justify-between gap-3">
          <div className="text-lg font-semibold">Edit image</div>
          <button
            className="rounded-md px-2 py-1 text-sm hover:bg-gray-100 disabled:opacity-50"
            onClick={onClose}
            disabled={saving}
          >
            Close
          </button>
        </div>

        <div className="mt-4 grid gap-3">
          <label className="grid gap-1">
            <div className="text-sm font-medium">Name</div>
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
              value={name}
              onChange={e => setName(e.target.value)}
              disabled={saving}
              placeholder="Image name"
            />
          </label>

          <label className="grid gap-1">
            <div className="text-sm font-medium">Replace image (optional)</div>
            <input
              type="file"
              accept="image/*"
              onChange={e => setFile(e.target.files?.[0] ?? null)}
              disabled={saving}
            />
          </label>

          <div className="grid gap-2">
            <div className="text-sm font-medium">Preview</div>
            <div className="flex gap-3">
              <div className="w-1/2 rounded-md border border-gray-200 p-2">
                <div className="text-xs text-gray-500">Current</div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="mt-2 h-40 w-full rounded object-contain bg-gray-50" src={apiUrl(image.url)} alt={image.name} />
              </div>
              <div className="w-1/2 rounded-md border border-gray-200 p-2">
                <div className="text-xs text-gray-500">New</div>
                {previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="mt-2 h-40 w-full rounded object-contain bg-gray-50" src={previewUrl} alt="New preview" />
                ) : (
                  <div className="mt-2 flex h-40 items-center justify-center rounded bg-gray-50 text-sm text-gray-500">
                    No new file selected
                  </div>
                )}
              </div>
            </div>
          </div>

          {error ? <div className="rounded-md bg-red-50 p-2 text-sm text-red-700">{error}</div> : null}

          <div className="mt-2 flex justify-end gap-2">
            <button
              className="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              className="rounded-md bg-black px-3 py-2 text-sm text-white hover:bg-black/90 disabled:opacity-50"
              onClick={onSubmit}
              disabled={saving}
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

