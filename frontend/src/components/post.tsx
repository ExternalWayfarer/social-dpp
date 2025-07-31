import { User } from "../types/author";
import { useAuth } from "../context/AuthContext";
import { usePost, useComments, useGroupReactions, useReactions } from "../components/hooks";
import api from "../services/api";


export interface TopicSummary {
  id: number;
  name: string;
}


export interface Post {
  id: number;
  title: string;
  body: string;
  author: User; //  nickname
  topic: TopicSummary | number | null; // can be an obj, num or null
  status: string; // 'DF', 'PB', 'AR'
  published_date: string; // ISO or null
  time_created_at: string; // ISO?
  time_updated_at: string; 
  comments_count: number;
  rating: number;
  content_type_id: number;
}



export interface PostProps {
    post: Post
 };

const PostComponent = ({ post }: PostProps) => {
    const { title, body, author, published_date, comments_count,rating } = post;
    const theAuthor = author.profile.nickname;
    /*
    const { user: currentUser, accessToken} = useAuth();  
    const { id: postId } = useParams<{ id: string }>();  
    const { post, loading, error } = usePost(postId);
    const {comments, loadingComments} = useComments(postId);
    const [isSubmittingReaction, setIsSubmittingReaction] = useState<boolean>(false);
    const {allReactions, loadingReactions, currentUserReaction} = useReactions(postId, post, currentUser, isSubmittingReaction)
    const groupedReactions = useGroupReactions(allReactions);


    const handleReactionClick = async (clickedReactionType: string) => {
      if (
        !accessToken ||
        !currentUser ||
        !post ||
        typeof post.content_type_id === "undefined" ||
        isSubmittingReaction
      ) {
        if (!accessToken || !currentUser) alert("sign in!");

        return;
      }
      setIsSubmittingReaction(true);

      try {
        await api.post("/reactions/", {
          reaction_type: clickedReactionType,
          content_type: post.content_type_id,
          object_id: post.id,
        });

        //fetchReactions();
      } catch (err) {
        console.error("error sending reaction:", err);
      } finally {
        setIsSubmittingReaction(false);
      }
    };

*/

    const PostPreview = () => {
      const shortBody = body.substring(0, 500) + "...\n";

      if (body.split("\n").length > 10 || body.length > 1000) {
        return shortBody;
      } else {
        return body;
      }
    };



    return (
        <div className="bg-white shadow-2xl rounded-lg p-6 md:p-10">
            <div>
              <h1 className="p-4 text-4xl font-bold text-black hover:text-blue-400">{title}</h1>
              
            </div>
            
            <div className="p-4 flex flex-row gap-x-3">
              <div className="text-sm text-indigo-500 hover:text-blue-400">
                {theAuthor}
              </div>
              <div className="text-sm text-gray-500">
                              posted {published_date ? new Date(published_date).toLocaleDateString("en-EN") : 'recently'}
              </div>
            </div>
            <div className="mt-4 p-4 text-lg prose max-w-none whitespace-pre-wrap">
              { PostPreview() }
              <p className="p-4 text-blue-600 hover:text-blue-400">Read full 📖</p>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-500">Rating: {rating}</p>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-500 hover:text-blue-400">💬 {comments_count}</p>
            </div>
                        <div className="p-4">
              <p className="text-sm text-gray-500 hover:text-blue-400">reactions</p>
            </div>
            
            
            
        </div>
        
    );
    
};

export default PostComponent;
