import { useEffect, useState } from 'react';
import { getRequestWithNativeFetch } from '../api/api'; // Sesuaikan path

const SinglePost = ({ postId, onBack }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchSinglePost = async () => {
      try {
        const postData = await getRequestWithNativeFetch(
          `https://jsonplaceholder.typicode.com/posts/${postId}`,
          controller.signal
        );
        setData(postData);
        setError(null);
      } catch (err) {
        if (err.name === 'AbortError') {
          console.log('Request was aborted');
          return;
        }
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSinglePost();

    return () => controller.abort();
  }, [postId]);

  if (loading) return <div>Loading post...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4 bg-white shadow rounded">
      <button onClick={onBack} className="text-blue-500 hover:underline">
        ← Back to Posts
      </button>
      <h1 className="text-2xl font-bold mb-4">{data?.title}</h1>
      <p>{data?.body}</p>
    </div>
  );
};

export default SinglePost;
