import { apiUrl } from '@/lib/api';
import { ImageItem } from '../types';

export async function fetchImages(): Promise<ImageItem[]> {
  const res = await fetch(apiUrl('/images'), { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to load images (${res.status})`);
  return await res.json();
}

export async function uploadImage(file: File): Promise<ImageItem> {
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch(apiUrl('/images'), { method: 'POST', body: fd });
  if (!res.ok) throw new Error(await safeErrorMessage(res, 'Upload failed'));
  return await res.json();
}

export async function patchImageJson(id: string, body: { name?: string }): Promise<ImageItem> {
  const res = await fetch(apiUrl(`/images/${id}`), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await safeErrorMessage(res, 'Update failed'));
  return await res.json();
}

export async function patchImageForm(id: string, opts: { name?: string; file?: File }): Promise<ImageItem> {
  const fd = new FormData();
  if (typeof opts.name === 'string') fd.append('name', opts.name);
  if (opts.file) fd.append('file', opts.file);
  const res = await fetch(apiUrl(`/images/${id}`), { method: 'PATCH', body: fd });
  if (!res.ok) throw new Error(await safeErrorMessage(res, 'Update failed'));
  return await res.json();
}

export async function deleteImage(id: string): Promise<void> {
  const res = await fetch(apiUrl(`/images/${id}`), { method: 'DELETE' });
  if (!res.ok) throw new Error(await safeErrorMessage(res, 'Delete failed'));
}

async function safeErrorMessage(res: Response, fallback: string): Promise<string> {
  try {
    const data = await res.json();
    if (typeof data?.message === 'string') return data.message;
    if (Array.isArray(data?.message)) return data.message.join(', ');
  } catch {
    // ignore
  }
  return `${fallback} (${res.status})`;
}

