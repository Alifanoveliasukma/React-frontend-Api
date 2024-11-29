import { useEffect, useState } from 'react';

const FetchGetRequest = () => {
  const [posts, setPosts] = useState(null); // Data semua post
  const [loading, setLoading] = useState(true); // Indikator loading untuk semua post
  const [error, setError] = useState(null); // Error untuk semua post
  const [selectedPost, setSelectedPost] = useState(null); // Data post detail
  const [postLoading, setPostLoading] = useState(false); // Indikator loading untuk post detail
  const [postError, setPostError] = useState(null); // Error untuk post detail
  const [newPost, setNewPost] = useState({ title: '', body: '' }); // Form untuk tambah post
  const [addPostError, setAddPostError] = useState(null); // Error untuk tambah post
  const [addPostLoading, setAddPostLoading] = useState(false); // Loading untuk tambah post
  const postsCacheKey = 'postsDataCache';

  // Fetch all posts
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const cachedPosts = localStorage.getItem(postsCacheKey);

      if (cachedPosts) {
        setPosts(JSON.parse(cachedPosts));
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          'https://jsonplaceholder.typicode.com/posts?_limit=8',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setPosts(data);

        // Cache posts
        localStorage.setItem(postsCacheKey, JSON.stringify(data));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Fetch selected post detail
  const fetchPostDetail = async (postId) => {
    setPostLoading(true);
    setPostError(null);

    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${postId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setSelectedPost(data);
    } catch (err) {
      setPostError(err.message);
    } finally {
      setPostLoading(false);
    }
  };

  // Add new post
  const addPost = async () => {
    if (!newPost.title || !newPost.body) {
      setAddPostError('Both title and body are required.');
      return;
    }

    setAddPostLoading(true);
    setAddPostError(null);

    try {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/posts',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(newPost),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const addedPost = await response.json();

      // Update posts and cache
      const updatedPosts = [addedPost, ...(posts || [])];
      setPosts(updatedPosts);
      localStorage.setItem(postsCacheKey, JSON.stringify(updatedPosts));

      // Clear form and select new post
      setNewPost({ title: '', body: '' });
      setSelectedPost(addedPost);
    } catch (err) {
      setAddPostError(err.message);
    } finally {
      setAddPostLoading(false);
    }
  };

  return (
    <div className="flex container">
      {/* Form Add Post */}
      <div className="w-full sm:w-1/2 bg-white p-4 shadow-lg mb-4">
        <h2 className="text-xl font-bold mb-4">Add New Post</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Title:</label>
          <input
            type="text"
            value={newPost.title}
            onChange={(e) =>
              setNewPost((prev) => ({ ...prev, title: e.target.value }))
            }
            className="w-full border px-2 py-1 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Body:</label>
          <textarea
            value={newPost.body}
            onChange={(e) =>
              setNewPost((prev) => ({ ...prev, body: e.target.value }))
            }
            className="w-full border px-2 py-1 rounded"
          />
        </div>
        {addPostError && <div className="text-red-700">{addPostError}</div>}
        <button
          onClick={addPost}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={addPostLoading}
        >
          {addPostLoading ? 'Adding...' : 'Add Post'}
        </button>
        <div>Error 404 yang terjadi ketika mengklik post yang baru dibuat itu muncul karena JSONPlaceholder adalah API dummy yang tidak benar-benar menyimpan data baru yang ditambahkan. Saat Anda menambahkan data dengan metode POST, API mengembalikan respons sukses dengan data yang ditambahkan, tetapi data ini hanya dibuat secara sementara di sisi klien dan tidak benar-benar tersimpan di server.</div>
      </div>

      {/* List Posts */}
      <div className="w-52 sm:w-80 flex flex-col items-center">
        {loading && <div className="text-xl font-medium">Loading posts...</div>}
        {error && <div className="text-red-700">{error}</div>}

        <ul>
          {posts &&
            posts.map((post) => (
              <li
                key={post.id}
                className="border-b border-gray-100 text-sm sm:text-base"
              >
                <button
                  className="p-4 block hover:bg-gray-100 w-full text-left"
                  onClick={() => fetchPostDetail(post.id)}
                >
                  {post.title}
                </button>
              </li>
            ))}
        </ul>
      </div>

      {/* Post Detail */}
      <div className="bg-gray-100 flex-1 p-4 min-h-[550px]">
        {postLoading && <div className="text-xl font-medium">Loading post...</div>}
        {postError && <div className="text-red-700">{postError}</div>}

        {selectedPost ? (
          <div>
            <h2 className="text-xl font-bold">{selectedPost.title}</h2>
            <p>{selectedPost.body}</p>
          </div>
        ) : (
          !postLoading && (
            <div className="text-gray-500">Select a post to see details...</div>
          )
        )}
      </div>
    </div>
  );
};

export default FetchGetRequest;
