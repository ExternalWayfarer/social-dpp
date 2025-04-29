export interface Author {
    //id: number;
    email: string;
};


export interface PostPreviewProps {
    id: number;
    author: Author;
    title: string;
    body: string;
    date?: Date;

 };

const PostPreview = ({ author, title, body }: PostPreviewProps) => {
    return (
        <div>
            <h3 className="text-4xl font-bold">{title}</h3>
            <p className="mt-4 text-lg">{author.email}</p>
            <p className="mt-4 text-lg">{body}</p>
        </div>
        
    );
    
};

export default PostPreview;
