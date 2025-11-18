import React, { useEffect, useState, useContext } from 'react';
import { getComments, addComment, editComment, deleteComment } from '../utils/apiEnhanced';
import { AuthContext } from '../context/AuthContext';

const CommentsPanel = ({ asset }) => {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [page, setPage] = useState(1);

  const getFirstName = (value = '') => {
    if (!value) return 'Anonymous';
    if (value.includes('@')) {
      const [namePart] = value.split('@');
      return namePart.split(/[^a-zA-Z]+/).filter(Boolean)[0] || namePart;
    }
    return value.split(' ')[0];
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type }), 2000);
  };

  const load = async () => {
    try {
      const { data } = await getComments(asset, page, 20);
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setError('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asset]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert('Login required');
    const value = text.trim();
    if (!value) return;
    setSubmitting(true);
    try {
      await addComment(asset, value);
      setText('');
      load();
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const onEdit = (id) => {
    const existing = items.find((i) => i._id === id);
    setEditingId(id);
    setEditText(existing?.text || '');
  };

  const submitEdit = async () => {
    if (!editingId) return;
    try {
      await editComment(editingId, editText);
      setEditingId(null);
      setEditText('');
      load();
      showToast('Comment updated');
    } catch (e) {
      alert('Failed to edit');
    }
  };

  const onDelete = (id) => {
    setDeletingId(id);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteComment(deletingId);
      setItems((arr) => arr.filter((x) => x._id !== deletingId));
      setDeletingId(null);
      showToast('Comment deleted');
    } catch (e) {
      alert('Failed to delete');
    }
  };

  if (loading) return <div className="text-light-gray animate-pulse">Loading comments...</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div className="border border-dark-gray/60 rounded-2xl p-4 bg-secondary-black/40 space-y-4">
      <h3 className="text-off-white font-semibold">Community Comments</h3>

      <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={user ? 'Share your thoughts...' : 'Login to comment'}
          disabled={!user || submitting}
          className="flex-1 px-3 py-2 rounded-lg bg-primary-black border border-dark-gray text-off-white focus:outline-none focus:ring-2 focus:ring-off-white/40 text-sm"
        />
        <button
          type="submit"
          disabled={!user || submitting}
          className="w-full sm:w-auto px-4 py-2 rounded-lg border border-off-white/60 text-xs uppercase tracking-[0.2em] hover:bg-off-white hover:text-primary-black transition-all whitespace-nowrap"
        >
          Post
        </button>
      </form>

      <div className="space-y-3">
        {(showAll ? items : items.slice(0, 3)).map((c) => (
          <div key={c._id} className="p-3 border border-dark-gray/50 rounded-xl bg-primary-black/50">
            <div className="text-xs text-light-gray/60 flex items-center justify-between">
              <span>{getFirstName(c.user?.emailOrMobile)}</span>
              <span>{new Date(c.createdAt).toLocaleString()}</span>
            </div>
            <div className="text-base sm:text-lg text-off-white mt-2 whitespace-pre-wrap leading-relaxed">{c.text}</div>
            {user && String(user._id) === String(c.user?._id || c.user) && (
              <div className="mt-2 flex gap-3 text-xs text-light-gray/70">
                <button onClick={() => onEdit(c._id)} className="hover:text-off-white">Edit</button>
                <button onClick={() => onDelete(c._id)} className="hover:text-red-400">Delete</button>
              </div>
            )}
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-light-gray/70 text-sm">No comments yet. Be the first to share.</div>
        )}
        {items.length > 3 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full py-2 text-center text-sm text-off-white/80 hover:text-off-white border border-dark-gray/50 rounded-lg hover:border-dark-gray transition-all"
          >
            {showAll ? 'Show Less' : `View All Comments (${items.length})`}
          </button>
        )}
      </div>

      {editingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setEditingId(null)} />
          <div className="relative z-10 w-full max-w-lg mx-auto rounded-2xl border border-dark-gray bg-primary-black p-5">
            <div className="text-off-white font-semibold mb-3">Edit Comment</div>
            <textarea
              className="w-full h-32 p-3 rounded-lg bg-secondary-black border border-dark-gray text-off-white focus:outline-none focus:ring-2 focus:ring-off-white/40"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            />
            <div className="mt-4 flex justify-end gap-2 text-sm">
              <button onClick={() => setEditingId(null)} className="px-3 py-2 rounded-lg border border-dark-gray text-light-gray hover:text-off-white">Cancel</button>
              <button onClick={submitEdit} className="px-3 py-2 rounded-lg border border-off-white/60 hover:bg-off-white hover:text-primary-black">Save</button>
            </div>
          </div>
        </div>
      )}

      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDeletingId(null)} />
          <div className="relative z-10 w-full max-w-md mx-auto rounded-2xl border border-dark-gray bg-primary-black p-5">
            <div className="text-off-white font-semibold mb-2">Delete Comment</div>
            <div className="text-light-gray mb-4">Are you sure you want to delete this comment? This action cannot be undone.</div>
            <div className="flex justify-end gap-2 text-sm">
              <button onClick={() => setDeletingId(null)} className="px-3 py-2 rounded-lg border border-dark-gray text-light-gray hover:text-off-white">Cancel</button>
              <button onClick={confirmDelete} className="px-3 py-2 rounded-lg border border-red-500 text-red-300 hover:bg-red-600/10">Delete</button>
            </div>
          </div>
        </div>
      )}

      {toast.show && (
        <div className="fixed top-4 right-4 z-[60]">
          <div className={`px-4 py-2 rounded-xl border text-sm shadow-lg transition-all ${
            toast.type === 'success'
              ? 'border-emerald-500/60 bg-emerald-600/10 text-emerald-300'
              : 'border-red-500/60 bg-red-600/10 text-red-300'
          }`}>
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentsPanel;
