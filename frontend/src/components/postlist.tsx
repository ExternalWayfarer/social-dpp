import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import PostPreview, { Post } from './post'
import api from "../services/api";




const PostList: React.FC= () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);




    const fetchPosts = async () => {
        try{
        const response = await api.get('posts');
        //console.log(response.data);
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
    console.log(posts);
    return ( 
        <div className="mx-auto grid grid-cols-4">
            {/*<h1 className="text-4xl font-bold text-center mb-12 text-gray-800">Main</h1>*/}
            <div />
            <div className="col-span-2 gap-8 p-4 space-y-8">
                
                {posts.map(post => (
                    <Link to={`/posts/${post.id}`} key={post.id} className="block">
                        <PostPreview post={post} />
                    </Link>
                ))}
                
            </div>
            
            <div />
        </div>
    );
};

export default PostList;