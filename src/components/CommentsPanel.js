import React, { useEffect, useState, useContext } from 'react';
import { getComments, addComment, editComment, deleteComment, getNewsComments, addNewsComment } from '../utils/apiEnhanced';
import { AuthContext } from '../context/AuthContext';

const CommentsPanel = ({ asset, isNews = false }) => {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [page] = useState(1);

  const getFirstName = (user, value = '') => {
    if (user?.isGuest && user?.firstName) return user.firstName;
    if (user?.firstName) return user.firstName;
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
      let data;
      if (isNews) {
        const res = await getNewsComments(asset);
        data = res.data;
      } else {
        const res = await getComments(asset, page, 20);
        data = res.data;
      }
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Failed to load comments:', e);
      setItems([]);
      setError('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (items.length === 0 && loading) {
      setItems([]);
      setLoading(false);
    }
    setLoading(true);
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asset, isNews]);

  const onSubmit = async (e, parentId = null) => {
    e.preventDefault();
    if (!user) return alert('Login required');

    const value = parentId ? replyText.trim() : text.trim();
    if (!value) return;

    setSubmitting(true);
    try {
      if (isNews) {
        await addNewsComment(asset, value, parentId);
      } else {
        await addComment(asset, value, parentId);
      }

      if (parentId) {
        setReplyText('');
        setReplyingId(null);
      } else {
        setText('');
      }
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

  // Organize comments into threads
  const rootComments = items.filter(c => !c.parentId);
  const getReplies = (parentId) => items.filter(c => c.parentId === parentId || (c.parentId && c.parentId._id === parentId));

  const CommentItem = ({ comment, depth = 0 }) => {
    const replies = getReplies(comment._id);
    const isReplying = replyingId === comment._id;

    return (
      <div className={depth > 0 ? 'ml-8 mt-3' : ''}>
        <div className={`p-4 rounded-xl bg-primary-black/50 ${depth > 0 ? 'border-l-2 border-blue-500/40 pl-4' : 'border border-dark-gray/50'}`}>
          <div className="text-xs text-light-gray/60 flex items-center justify-between mb-2">
            <span className="flex items-center gap-2">
              <span className="font-medium text-off-white/90">{getFirstName(comment.user, comment.user?.emailOrMobile)}</span>
              {comment.user?.isGuest && (
                <span className="text-xs px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded-full">Guest</span>
              )}
            </span>
            <span>{new Date(comment.createdAt).toLocaleString()}</span>
          </div>
          <div className="text-base sm:text-lg text-off-white whitespace-pre-wrap leading-relaxed">{comment.text}</div>

          <div className="mt-3 flex gap-3 text-xs text-light-gray/70">
            <button onClick={() => setReplyingId(isReplying ? null : comment._id)} className="hover:text-blue-400 transition-colors">
              {isReplying ? 'Cancel' : 'Reply'}
            </button>
            {user && String(user._id) === String(comment.user?._id || comment.user) && (
              <>
                <button onClick={() => onEdit(comment._id)} className="hover:text-off-white transition-colors">Edit</button>
                <button onClick={() => onDelete(comment._id)} className="hover:text-red-400 transition-colors">Delete</button>
              </>
            )}
          </div>

          {isReplying && (
            <form onSubmit={(e) => onSubmit(e, comment._id)} className="mt-3 flex gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 px-3 py-2 rounded-lg bg-secondary-black border border-dark-gray text-off-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 text-sm"
                autoFocus
              />
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 rounded-lg bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 text-xs uppercase tracking-wider transition-colors"
              >
                Reply
              </button>
            </form>
          )}
        </div>

        {replies.length > 0 && (
          <div className="space-y-0">
            {replies.map(reply => (
              <CommentItem key={reply._id} comment={reply} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loading) return <div className="text-light-gray animate-pulse">Loading comments...</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div className="border border-dark-gray/60 rounded-2xl p-4 bg-secondary-black/40 space-y-4">
      <h3 className="text-off-white font-semibold">{isNews ? 'Discussion' : 'Community Comments'}</h3>

      <form onSubmit={(e) => onSubmit(e)} className="flex flex-col sm:flex-row gap-2">
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
        {(showAll ? rootComments : rootComments.slice(0, 3)).map((c) => (
          <CommentItem key={c._id} comment={c} />
        ))}
        {rootComments.length === 0 && (
          <div className="text-light-gray/70 text-sm">No comments yet. Be the first to share.</div>
        )}
        {rootComments.length > 3 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full py-2 text-center text-sm text-off-white/80 hover:text-off-white border border-dark-gray/50 rounded-lg hover:border-dark-gray transition-all"
          >
            {showAll ? 'Show Less' : `View All Comments (${rootComments.length})`}
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
          <div className={`px-4 py-2 rounded-xl border text-sm shadow-lg transition-all ${toast.type === 'success'
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
