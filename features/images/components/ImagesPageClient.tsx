'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { deleteImage, fetchImages, uploadImage } from '../api/api';
import { ImageItem } from '../types';
import ImageList from './ImageList';
import EditModal from './EditModal';
import ShowModal from './ShowModal';

export default function ImagesPageClient() {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [items, setItems] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [showOpen, setShowOpen] = useState(false);
  const [active, setActive] = useState<ImageItem | null>(null);

  const sorted = useMemo(() => items, [items]);

  async function reload() {
    setError(null);
    setLoading(true);
    try {
      const data = await fetchImages();
      setItems(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleUpload() {
    const file = selectedFile;
    if (!file) {
      setError('Please choose a file');
      return;
    }

    setUploading(true);
    setError(null);
    try {
      const created = await uploadImage(file);
      setItems(prev => [created, ...prev]);
      setSelectedFile(null);
      if (fileRef.current) fileRef.current.value = '';
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  function openEdit(img: ImageItem) {
    setActive(img);
    setEditOpen(true);
  }

  function openShow(img: ImageItem) {
    setActive(img);
    setShowOpen(true);
  }

  async function handleDelete(img: ImageItem) {
    setDeletingId(img.id);
    setError(null);

    const prev = items;
    setItems(cur => cur.filter(x => x.id !== img.id)); // optimistic
    try {
      await deleteImage(img.id);
    } catch (e: unknown) {
      setItems(prev); // rollback
      throw e;
    } finally {
      setDeletingId(null);
    }
  }

  function onUpdated(updated: ImageItem) {
    setItems(prev => prev.map(x => (x.id === updated.id ? updated : x)));
    setActive(updated);
  }

  return (
    <div className="mx-auto w-full max-w-6xl p-6">
      <div className="flex flex-col gap-1">
        <div className="text-2xl font-semibold">Images</div>
        <div className="text-sm text-gray-600">Upload, edit name, replace files, and delete safely.</div>
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="grid gap-2">
            <div className="text-sm font-medium">Upload image</div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={e => setSelectedFile(e.target.files?.[0] ?? null)}
            />

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
              >
                Chọn ảnh
              </button>
              <div className="text-sm text-gray-700">
                {selectedFile ? selectedFile.name : <span className="text-gray-500">Chưa chọn ảnh</span>}
              </div>
            </div>

            <div className="text-xs text-gray-500">Max 5MB. Server will resize to 800px and convert to WebP.</div>

            {selectedFile ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="mt-1 h-24 w-40 rounded-md border border-gray-200 bg-gray-50 object-cover"
                src={URL.createObjectURL(selectedFile)}
                alt="Selected preview"
                onLoad={e => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
              />
            ) : null}
          </div>
          <div className="flex gap-2">
            <button
              className="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
              onClick={reload}
              disabled={loading || uploading}
            >
              Refresh
            </button>
            <button
              className="rounded-md bg-black px-3 py-2 text-sm text-white hover:bg-black/90 disabled:opacity-50"
              onClick={handleUpload}
              disabled={uploading || !selectedFile}
            >
              {uploading ? 'Uploading…' : 'Upload'}
            </button>
          </div>
        </div>

        {error ? <div className="mt-3 rounded-md bg-red-50 p-2 text-sm text-red-700">{error}</div> : null}
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-600">Loading…</div>
        ) : (
          <ImageList items={sorted} deletingId={deletingId} onEdit={openEdit} onShow={openShow} onDelete={handleDelete} />
        )}
      </div>

      <EditModal
        open={editOpen}
        image={active}
        onClose={() => setEditOpen(false)}
        onUpdated={onUpdated}
      />
      <ShowModal open={showOpen} image={active} onClose={() => setShowOpen(false)} />
    </div>
  );
}

