// src/components/CreatePost.js
import { useState } from 'react';
import { postRequestWithFetch } from '../api/api'; // Pastikan path benar

const CreatePost = ({ onPostCreated }) => {
  const [newPost, setNewPost] = useState({
    userId: '',
    title: '',
    body: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await postRequestWithFetch(newPost);
      onPostCreated(result); // Memanggil callback untuk memberi tahu parent bahwa post baru sudah dibuat
      setNewPost({ userId: '', title: '', body: '' }); // Clear form
    } catch (err) {
      setError('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Create a New Post</h2>
      <form onSubmit={handlePostSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">User ID</label>
          <input
            type="number"
            name="userId"
            value={newPost.userId}
            onChange={(e) => setNewPost({ ...newPost, userId: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Body</label>
          <textarea
            name="body"
            value={newPost.body}
            onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Creating Post...' : 'Create Post'}
        </button>
      </form>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
};

export default CreatePost;
