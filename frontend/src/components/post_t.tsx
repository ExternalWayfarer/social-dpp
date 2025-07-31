import { PostProps, Post } from "./post";
import { useState, useEffect } from "react";
import api from "../services/api";
import axios from "axios";



const PostComponent = ({ post }: PostProps) => {
    const { id, title, body, author, published_date, comments_count,rating } = post;
    const theAuthor = author.profile.nickname;
    const [loadingPost, setLoadingPost] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [postObject, setPostObject] = useState<Post | null>(null); 




    const PostPreview =()=>  {
      const shortBody = body.substring(0,500) + '...\n';
      
      if (body.split('\n').length>10 || body.length>1000) {
        return shortBody;
      } else {
        return body;
      }
    }

    const fetchPost = async () => {
      if (!id) {
        setLoadingPost(false);
        setError("ID none");
        return;
      }
      setLoadingPost(true);
      setError(null);

      try {
        const response = await api.get<Post>(`/posts/${id}`);

        setPostObject(response.data);
        //console.log(response.data);
      } catch (err) {
        console.error("error while loading post:", err);
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setError("post not found");
        } else {
          setError("error while loading post:");
        }
      } finally {
        setLoadingPost(false);
      }
    };

      useEffect(() => {
        fetchPost();
      }, [id]);

 if (loadingPost) {
    return <p className="mt-16 p-4 text-center">loading post...</p>;
 }
    return (
        <div className="bg-white shadow-2xl rounded-lg p-6 md:p-10">
            <div>
              <h1 className="p-4 text-4xl font-bold text-black hover:text-blue-400">{title}</h1>
              
            </div>
            
            <div className="p-4 flex flex-row gap-x-3">
              <div className="text-sm text-indigo-500 hover:text-blue-400">
                {theAuthor}
              </div>
              <div className="text-sm text-gray-500">
                              posted {published_date ? new Date(published_date).toLocaleDateString("en-EN") : 'recently'}
              </div>
            </div>
            <div className="mt-4 p-4 text-lg prose max-w-none whitespace-pre-wrap">
              
              { PostPreview() }
              <p className="p-4 text-blue-600 hover:text-blue-400">Read full 📖</p>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-500">Rating: {rating}</p>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-500 hover:text-blue-400">💬 {comments_count}</p>
            </div>
                        <div className="p-4">
              <p className="text-sm text-gray-500 hover:text-blue-400">reactions</p>
            </div>
            
            
            
        </div>
        
    );
    
};

export default PostComponent;