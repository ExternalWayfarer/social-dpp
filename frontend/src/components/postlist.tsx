import React, { useState, useEffect } from 'react';
import PostPreview from './post'
import api from "../services/api";

export interface Author {
    id: number;
    email: string;
}


export interface Post {
    id: number;
    author: Author;
    title: string;
    text: string;
    date?: Date;

 };




const PostList: React.FC= () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);




    const fetchPosts = async () => {
        try{
        const response = await api.get('/api/posts');
        
        setPosts(response.data);
        console.log(response.data[0]);
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
                author={post.author.email}
                title={post.title}
                text={post.text}

                />
            ))}
        </div>
    );
};

export default PostList;