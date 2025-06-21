import { User, Profile } from "../types/author"
/*
export interface CommentAuthor {
  id: number;
  profile: AuthorProfile;
}
*/
export interface PostComment {
  id: number;
  postId: number;
  body: string;
  author: User; //  nickname
  time_created_at: string; // ISO?
  time_updated_at: string;
  rating: number;
  // another fields
}

export interface CommentProps {
  comment: PostComment;
}









const CommentPreview = ({ comment }: CommentProps) => {
  const {  body, author, time_created_at, rating } = comment;
  const theAuthor = author?.profile?.nickname;
  return (
    <div className="hover:bg-slate-50 p-2">
      <div className="flex flex-row gap-x-3">
        <div className="text-sm text-indigo-500 hover:text-blue-400">
          {theAuthor}
        </div>
        <div className="text-sm text-gray-500">
          {time_created_at ? new Date(time_created_at).toLocaleDateString() : "recently"}
        </div>
      </div>
      <div className="pt-2 pb-2">{body}</div>

      <div>⭐ {rating}</div>
    </div>
  );
};

export default CommentPreview;
