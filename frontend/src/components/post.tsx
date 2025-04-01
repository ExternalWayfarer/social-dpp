import React from 'react';

export interface Author {
    id: number;
    email: string;
}


 interface PostPreviewProps {
    
    author: Author;
    title: string;
    text: string;
    date?: Date;
    
 };

const PostPreview: React.FC<PostPreviewProps> = ({ author, title, text }) => {
    return (
        <div>
            <h3 className="text-4xl font-bold">{title}</h3>
            <p className="mt-4 text-lg">{author}</p>
            <p className="mt-4 text-lg">{text}</p>
        </div>
    );
};

export default PostPreview;
