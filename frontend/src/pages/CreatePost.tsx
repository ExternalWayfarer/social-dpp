import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Ваш настроенный Axios
import { Post } from '../components/post'; // Ваши типы

const CreatePostPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<number | ''>(''); // Храним ID топика
  //const [topics, setTopics] = useState<TopicSummary[]>([]); 
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  //const [loadingTopics, setLoadingTopics] = useState<boolean>(true);

  const navigate = useNavigate();
/*
  useEffect(() => {
    const fetchTopics = async () => {
      setLoadingTopics(true);
      try {

        const response = await api.get<TopicSummary[]>('/topics/'); 
        if (Array.isArray(response.data)) { 
            setTopics(response.data);
        } else if (response.data && Array.isArray((response.data as any).results)) {
             setTopics((response.data as any).results);
        }

      } catch (err) {
        console.error("error:", err);
      } finally {
        setLoadingTopics(false);
      }
    };
    fetchTopics();
  }, []);
*/
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const postData: { title: string; body: string; topic?: number } = {
        title,
        body,
      };
      if (selectedTopic !== '') {
        postData.topic = selectedTopic;
      }


      const response = await api.post<Post>('/posts/', postData);

      console.log('Post successfully created:', response.data);
      navigate(`/posts/${response.data.id}`);

    } catch (err: any) {
      console.error('erorr create:', err);
      if (err.response && err.response.data) {

        const errorData = err.response.data;
        let errorMessage = 'validation error: ';
        for (const key in errorData) {
          errorMessage += `${key}: ${errorData[key].join(', ')} `;
        }
        setError(errorMessage.trim());
      } else {
        setError('cant create. try later');
      }
    } finally {
      setLoading(false);
    }
  };

  //if (loadingTopics) {return <div className="container mx-auto mt-20 p-4 text-center">Загрузка топиков...</div>;}

  return (
    <div className="container mx-auto mt-20 p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">new post</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {error && <p className="mb-4 text-sm text-red-600 bg-red-100 p-3 rounded">{error}</p>}

        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
            Заголовок:
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            disabled={loading}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="body" className="block text-gray-700 text-sm font-bold mb-2">
            Text:
          </label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-40"
            required
            disabled={loading}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="topic" className="block text-gray-700 text-sm font-bold mb-2">
            Topic:
          </label>
          <select
            id="topic"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(Number(e.target.value) || '')}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            <option value="">Choose topiuc</option>
            {/*topics.map(topic => (
              <option key={topic.id} value={topic.id}>
                {topic.name}
              </option>
            ))*/}
          </select>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-blue-300"
            disabled={loading}
          >
            {loading ? '...' : 'Create post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePostPage;