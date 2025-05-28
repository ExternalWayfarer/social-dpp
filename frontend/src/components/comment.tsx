import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import api from "../services/api";
import { AuthorProfile } from './post';



export interface CommentAuthor {
  id: number;
  //email: string;
  profile: AuthorProfile; 
}



export interface PostComment {
    id: number;
    postId: number;
    body: string;
    author: CommentAuthor; //  nickname
    time_created_at: string; // ISO?
    time_updated_at: string; 
    rating: number;
    // another fields
}




export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}


export interface CommentProps {
    comment: PostComment
 };


const CommentPreview = ({comment} :CommentProps) => {
    const { id, body, author, time_created_at, time_updated_at, rating } = comment;
    const theAuthor = author?.profile?.nickname;
    return(
        <div className='hover:bg-slate-50 p-2'>
            <div className='flex flex-row gap-x-3'>
            <div className=''>
                {theAuthor}
            </div>
            <div>
                {time_created_at ? new Date(time_created_at).toLocaleDateString() : 'recently'}
            </div>
            </div>
            <div className='pt-2 pb-2'>
                {body}
            </div> 
            
             <div>
                ⭐ {rating}
            </div> 
                     
        </div>
    );
};

export default CommentPreview;

/*


const CommentList: React.FC= () => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);




    const fetchComments = async () => {
        try{
        const response = await api.get('comments');
        //console.log(response.data);
        setComments(response.data);
        console.log(response.data[0]);
        } catch (err) {
            setError('Error while loading comments');
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchComments();
    },[]);
    if (loading) return <div>Loading</div>;
    if (error) return <div>{error}</div>;
    console.log(comments);
    return ( 
        <div className="mx-auto grid grid-cols-4">
            <div />
            <div className="col-span-2 gap-8 p-4 space-y-8">
                {comments.map(comment => (
                    
                    <Link to={`/comments/${comment.id}`} key={comment.id} className="block">
                        <CommentPreview comment={comment} />
                    </Link>
                    
                ))}
            </div>
            <div />
        </div>
    );
};

export default CommentList;
*/