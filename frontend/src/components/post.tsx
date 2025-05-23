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
  published_date: string | null; // ISO or null
  time_created_at: string; // ISO?
  time_updated_at: string; 
  // another fields
}


export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}


export interface PostPreviewProps {
    post: Post
 };

const PostPreview = ({ post }: PostPreviewProps) => {
    const { id, title, body, author, topic, published_date, time_created_at } = post;
    const theAuthor = author.profile.nickname
    return (
        <div>
            
            <h3 className="text-4xl font-bold">{title}</h3>
            <p className="mt-4 text-lg">{theAuthor}</p>
            <p className="mt-4 text-lg">{body}</p>
        </div>
        
    );
    
};

export default PostPreview;
