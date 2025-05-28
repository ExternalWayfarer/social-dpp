import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
//import PostPreview from '../components/post'
import api from "../services/api";
import axios from 'axios';

import { Post } from '../components/post';
import CommentPreview, { PaginatedResponse, PostComment} from '../components/comment'



const PostPage: React.FC = () => { 
    const { id: postId } = useParams<{ id: string }>();;
    const [post, setPost] =  useState<Post | null>(null);
    const [loadingPost, setLoadingPost] = useState<boolean>(true);
    const [comments, setComments] = useState<PostComment[]>([]);
    const [loadingComments, setLoadingComments] = useState<boolean>(true); 
    const [error, setError] = useState<string | null>(null);


    const fetchPost = async () => {
        if (!postId) { 
        setLoadingPost(false);
        setError("ID none");
        return;
      }
      setLoadingPost(true);
      setError(null);

        try{
        const response = await api.get<Post>(`/posts/${postId}`);
        
        setPost(response.data);
        console.log(response.data);
        } catch (err) {
            console.error("error while loading post:", err);
            if (axios.isAxiosError(err) && err.response?.status === 404) {
            setError('post not found');
            } else {
            setError('error while loading post:');
            
            }
        }
        finally {
            setLoadingPost(false);
        }
    };
    
    const fetchPostComments = async () => {
    if (!postId) { 
        setLoadingComments(false);
        return;
    }
      setLoadingComments(true);
      try {
        //const response = await api.get<PaginatedResponse<PostComment>>('/comments/', { params: { post: postId } });
        const response = await api.get<PostComment[]>('/comments/', { params: { post: postId } });
        console.log('api response:', response.data);

        //if (response.data && Array.isArray(response.data.results)) { setComments(response.data.results); }  
        if (response.data && Array.isArray(response.data)) {
             setComments(response.data); 
            console.log('first comment:', response.data[0]);
            }
        
        else {
            console.warn("API doesn't return array");
            setComments([]);
        }
      } catch (err) {
        console.error(" error while loading comments:", err);
      } finally {
        setLoadingComments(false);
      }
    };


    useEffect(() => {
        fetchPost();
        },[postId]);


    useEffect(() => {
    fetchPostComments();
  }, [postId]); 

  // --- render ---
  if (loadingPost) {
    return <p className="mt-16 p-4 text-center">loading post...</p>;
  }
  if (error && !post) { 
    return <p className="mt-16 p-4 text-center text-red-500">error: {error}</p>;
  }
  if (!post) {
    return <p className="mt-16 p-4 text-center">post not fiund.</p>;
  }



    return (
         <React.Fragment>
      <main className="mt-16 p-4 space-y-8 bg-slate-100">
        <div className='mx-auto grid grid-cols-4'>
            <div />
            <div className='col-span-2 bg-white rounded-lg shadow'>
                <h1 className="p-4 text-4xl font-bold text-black">{post.title}</h1>
                        <div className="p-4 flex flex-row gap-x-3">
                            <div className="text-sm text-indigo-500 hover:text-blue-400">
                                {post.author?.profile?.nickname || `User ${post.author?.id}` || 'User unknown'} 
                            </div>
                            <div className="text-sm text-gray-500">
                                posted {post.published_date ? new Date(post.published_date).toLocaleDateString() : 'recently'}
                            </div>

                        </div>
        
                        <div className="mt-4 p-4 text-lg prose max-w-none">
                            {/* if HTML, then dangerouslySetInnerHTML. if just simpl;e text {post.body} */}
                            { post.body } 
                        </div>
                        <div className="p-4">
                            <p className="text-sm text-gray-500">⭐ {post.rating}</p>
                        </div>
            </div>

            
            <div />
        </div>
        <div>
            <section className="bg-white p-6 md:p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Comments ({comments.length})</h2>
        {loadingComments && <p>loading...</p>}
        
        {!loadingComments && comments.length === 0 && <p className="text-gray-500">there's no comments yet</p>}
        <div className="space-y-4">
          {comments.map(comment => (
            <CommentPreview key={comment.id} comment={comment} />
          ))}
        </div>
        {/* <AddCommentForm postId={post.id} onCommentAdded={(newComment) => setComments(prev => [newComment, ...prev])} /> */}
      </section>
        </div>
       
      </main>
    </React.Fragment>
    );
    };




export default PostPage;