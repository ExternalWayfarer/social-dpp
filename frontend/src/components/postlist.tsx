import React, { useState, useEffect } from 'react';
import PostPreview, { PostPreviewProps } from './post'
import api from "../services/api";




const PostList: React.FC= () => {
    const [posts, setPosts] = useState<PostPreviewProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);




    const fetchPosts = async () => {
        try{
        const response = await api.get('/api/posts');
        //console.log(response.data);
        setPosts(response.data);
        //console.log(response.data[0]);
        } catch (err) {
            setError('Error while loading posts');
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchPosts();
    },[]);
    if (loading) return <div>Loading</div>;
    if (error) return <div>{error}</div>;
    return (
        <div >
            {posts.map(post => (
                <PostPreview
                key={post.id}
                id={post.id}
                author={post.author}
                title={post.title}
                body={post.body}
                />
            ))}
        </div>
    );
};

export default PostList;