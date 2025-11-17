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
  const [page] = useState(1);

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

  const onEdit = async (id) => {
    const existing = items.find((i) => i._id === id);
    const next = prompt('Edit comment:', existing?.text || '');
    if (next == null) return;
    try {
      await editComment(id, next);
      load();
    } catch (e) {
      alert('Failed to edit');
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await deleteComment(id);
      setItems((arr) => arr.filter((x) => x._id !== id));
    } catch (e) {
      alert('Failed to delete');
    }
  };

  if (loading) return <div className="text-light-gray animate-pulse">Loading comments...</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div className="border border-dark-gray/60 rounded-2xl p-4 bg-secondary-black/40 space-y-4">
      <h3 className="text-off-white font-semibold">Community Comments</h3>

      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={user ? 'Share your thoughts...' : 'Login to comment'}
          disabled={!user || submitting}
          className="flex-1 px-3 py-2 rounded-lg bg-primary-black border border-dark-gray text-off-white focus:outline-none focus:ring-2 focus:ring-off-white/40"
        />
        <button
          type="submit"
          disabled={!user || submitting}
          className="px-4 py-2 rounded-lg border border-off-white/60 text-xs uppercase tracking-[0.2em] hover:bg-off-white hover:text-primary-black transition-all"
        >
          Post
        </button>
      </form>

      <div className="space-y-3">
        {items.map((c) => (
          <div key={c._id} className="p-3 border border-dark-gray/50 rounded-xl bg-primary-black/50">
            <div className="text-xs text-light-gray/60 flex items-center justify-between">
              <span>{c.user?.emailOrMobile || 'Anonymous'}</span>
              <span>{new Date(c.createdAt).toLocaleString()}</span>
            </div>
            <div className="text-sm text-off-white mt-2 whitespace-pre-wrap">{c.text}</div>
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
      </div>
    </div>
  );
};

export default CommentsPanel;
