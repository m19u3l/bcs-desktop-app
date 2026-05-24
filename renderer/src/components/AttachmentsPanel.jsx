import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Paperclip, Upload, X, FileText, Image, Film, Loader2, ZoomIn } from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const FILE_BASE = `${API}/attachments/file/`;

const fmtSize = b => b < 1024 ? `${b}B` : b < 1048576 ? `${(b/1024).toFixed(0)}KB` : `${(b/1048576).toFixed(1)}MB`;

function FileIcon({ type }) {
  if (type?.startsWith('image/')) return <Image size={20} className="text-blue-500" />;
  if (type?.startsWith('video/')) return <Film size={20} className="text-purple-500" />;
  return <FileText size={20} className="text-gray-500" />;
}

/**
 * AttachmentsPanel — drop-in attachments section for any document modal.
 *
 * Props:
 *   entityType  string  e.g. 'invoice', 'estimate', 'work_order', 'client'
 *   entityId    number  the record's PK
 *   readOnly    bool    hides upload controls
 */
export default function AttachmentsPanel({ entityType, entityId, readOnly = false }) {
  const [attachments, setAttachments] = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [uploading,   setUploading]   = useState(false);
  const [dragOver,    setDragOver]    = useState(false);
  const [lightbox,    setLightbox]    = useState(null);  // attachment obj or null
  const inputRef = useRef(null);

  const fetchAttachments = useCallback(async () => {
    if (!entityId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/attachments?entity_type=${entityType}&entity_id=${entityId}`);
      setAttachments(await res.json());
    } catch (_) {}
    setLoading(false);
  }, [entityType, entityId]);

  useEffect(() => { fetchAttachments(); }, [fetchAttachments]);

  const uploadFiles = async (files) => {
    if (!files?.length || !entityId) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('entity_type', entityType);
      form.append('entity_id',   String(entityId));
      for (const f of files) form.append('files', f);
      const res = await fetch(`${API}/attachments`, { method: 'POST', body: form });
      if (!res.ok) throw new Error(await res.text());
      await fetchAttachments();
    } catch (err) {
      console.error('Upload failed:', err);
    }
    setUploading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this attachment?')) return;
    try {
      await fetch(`${API}/attachments/${id}`, { method: 'DELETE' });
      setAttachments(a => a.filter(x => x.id !== id));
    } catch (_) {}
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    uploadFiles(Array.from(e.dataTransfer.files));
  };

  const images = attachments.filter(a => a.file_type?.startsWith('image/'));
  const others = attachments.filter(a => !a.file_type?.startsWith('image/'));

  if (!entityId) return null;

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2 mb-3">
        <Paperclip size={15} className="text-gray-500" />
        <span className="text-sm font-semibold text-gray-700">Photos & Files</span>
        <span className="text-xs text-gray-400">({attachments.length})</span>
      </div>

      {/* Image grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
          {images.map(a => (
            <div key={a.id} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
              <img
                src={FILE_BASE + a.filename}
                alt={a.original_name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => setLightbox(a)}
                  className="p-1 bg-white/90 rounded-full text-gray-800 hover:bg-white"
                  title="View"
                >
                  <ZoomIn size={13} />
                </button>
                {!readOnly && (
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="p-1 bg-white/90 rounded-full text-red-600 hover:bg-white"
                    title="Delete"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Non-image file list */}
      {others.length > 0 && (
        <div className="space-y-1.5 mb-3">
          {others.map(a => (
            <div key={a.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm">
              <FileIcon type={a.file_type} />
              <a
                href={FILE_BASE + a.filename}
                target="_blank"
                rel="noreferrer"
                className="flex-1 text-blue-600 hover:underline truncate"
              >
                {a.original_name}
              </a>
              <span className="text-xs text-gray-400 flex-shrink-0">{fmtSize(a.file_size)}</span>
              {!readOnly && (
                <button onClick={() => handleDelete(a.id)} className="text-red-400 hover:text-red-600 flex-shrink-0">
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-4">
          <Loader2 size={18} className="animate-spin text-gray-400" />
        </div>
      )}

      {!loading && attachments.length === 0 && (
        <p className="text-xs text-gray-400 text-center py-2">No attachments yet</p>
      )}

      {/* Upload drop zone */}
      {!readOnly && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => !uploading && inputRef.current?.click()}
          className={`flex items-center justify-center gap-2 py-2.5 border-2 border-dashed rounded-lg text-xs font-medium cursor-pointer transition-colors ${
            dragOver
              ? 'border-blue-400 bg-blue-50 text-blue-600'
              : 'border-gray-300 text-gray-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50'
          }`}
        >
          {uploading
            ? <><Loader2 size={14} className="animate-spin" /> Uploading…</>
            : <><Upload size={14} /> {dragOver ? 'Drop files here' : 'Add photos or files'}</>
          }
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*,video/mp4,application/pdf"
        className="hidden"
        onChange={e => { uploadFiles(Array.from(e.target.files)); e.target.value = ''; }}
      />

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/85 z-[100] flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <img
            src={FILE_BASE + lightbox.filename}
            alt={lightbox.original_name}
            className="max-w-full max-h-full rounded-lg shadow-2xl"
            onClick={e => e.stopPropagation()}
          />
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white"
          >
            <X size={20} />
          </button>
          <p className="absolute bottom-4 text-white/70 text-sm">{lightbox.original_name}</p>
        </div>
      )}
    </div>
  );
}
