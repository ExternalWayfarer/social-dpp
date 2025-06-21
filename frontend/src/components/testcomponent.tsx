import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";


import { Link } from 'react-router-dom'; 
import api from "../services/api";

//----------- interfaces ------------

export interface AuthorProfile {
  nickname: string | null;
  user_bio?: string; 
  user_avatar?: string; 
}

export interface PostAuthor {
  id: number;
  //email: string;
  profile: AuthorProfile; 
}

export interface PostComment {
  id: number;
  postId: number;
  body: string;
  author: PostAuthor; //  nickname
  time_created_at: string; // ISO?
  time_updated_at: string;
  rating: number;
  // another fields
}

export interface TopicSummary {
  id: number;
  name: string;
}


export interface Post {
  id: number;
  title: string;
  body: string;
  author: PostAuthor; //  nickname
  topic: TopicSummary | number | null; // can be an obj, num or null
  status: string; // 'DF', 'PB', 'AR'
  published_date: string; // ISO or null
  time_created_at: string; // ISO?
  time_updated_at: string; 
  comments_count: number;
  rating: number;
  content_type_id: number;
}




export const PostComponent: React.FC =(props) => {

const [post, setPost] = useState<Post | null>(null);
const [posts, setPosts] = useState<Post[]>([]);
const [comments, setComments] = useState<Record<number,PostComment[]>>({});
 const [ postId, setPostId ] = useState< string >(); 


useEffect(()=>{
    fetch('http://localhost:8000/api/posts/')
    .then((res)=>res.json())
    .then((data)=> setPosts(data))

},[]);
useEffect(()=>{
    posts.forEach(post => {
  fetch(`http://localhost:8000/api/comments?post=${post?.id}`)
    .then((res)=>res.json())
    .then((data)=> {setComments(prev=>
         ({...prev,
            [post.id]:data})
        )})
    .then(()=>console.log(comments[post.id]));
    })
    
  

},[posts]);




return(
<React.Fragment>
<main>
    
    <div className=''>{posts.map((post)=>(<div key={post.id}> 
    <h1 className='text-xl text-blue-700'> {post.title}</h1>
    <p className='text-xs'>{post.author.profile.nickname}</p>
    <p className=''>{post.body}</p>
    
    <div> 
        <p>{post.comments_count}</p>
        {(comments[post.id] || []).map((comment)=>
                <div key={comment.id}>
                <p>{comment.body}</p>

                </div>
              )}
    </div>
     </div>     
))}

    </div>
    
</main>
</React.Fragment>);
};