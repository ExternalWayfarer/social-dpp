import React from 'react';
import { Link } from 'react-router-dom'; 
import PostComponent from './post'
import { usePostlist } from './hooks';




const PostList: React.FC= () => {
  
    const {postList, postListLoading, postListError} = usePostlist()

    if (postListLoading) return <div>Loading</div>;
    if (postListError) return <div>{postListError}</div>;

    return ( 
        <div className="mx-auto grid grid-cols-4">
            {/*<h1 className="text-4xl font-bold text-center mb-12 text-gray-800">Main</h1>*/}
            <div />
            <div className="col-span-2 gap-8 p-4 space-y-8">
                
                {postList.map(post => (
                    <Link to={`/posts/${post.id}`} key={post.id} className="block">
                        <PostComponent post={post} />
                    </Link>
                ))}
                
            </div>
            
            <div />
        </div>
    );
};

export default PostList;