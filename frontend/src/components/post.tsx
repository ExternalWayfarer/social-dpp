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
  rating: number;
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
    const { id, title, body, author, topic, published_date, rating } = post;
    const theAuthor = author.profile.nickname;
    return (
        <div className="bg-white rounded-lg">
            <div>
              <h1 className="p-4 text-4xl font-bold text-black hover:text-blue-400">{title}</h1>
            </div>
            
            <div className="p-4 flex flex-row gap-x-3">
              <div className="text-sm text-indigo-500 hover:text-blue-400">
                {theAuthor}
              </div>
              <div className="text-sm text-gray-500">
                              posted {published_date ? new Date(published_date).toLocaleDateString() : 'recently'}
              </div>
            </div>
            <div className="mt-4 p-4 text-lg prose max-w-none whitespace-pre-wrap">
              {/* if HTML, then dangerouslySetInnerHTML. if just simpl;e text {body} */}
              { body } 
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-500">⭐ {rating}</p>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-500 hover:text-blue-400">💬 0</p>
            </div>
            
            
            
        </div>
        
    );
    
};

export default PostPreview;
