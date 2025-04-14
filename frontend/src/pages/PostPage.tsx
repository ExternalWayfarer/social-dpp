import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import PostPreview, { PostPreviewProps } from '../components/post'
import api from "../services/api";




const PostPage: React.FC = () => { 
    const { id } = useParams();
    const [posts, setPosts] = useState<PostPreviewProps[]>([]);
    const fetchPosts = async () => {
        try{
        const response = await api.get('/api/posts');
        
        setPosts(response.data);
        console.log(response.data[0]);
        } catch (err) {
            alert('Error while loading posts');

    };
    
    useEffect(() => {
        fetchPosts();
    },[id]);
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
};



export default PostPage;