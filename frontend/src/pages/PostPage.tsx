import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
//import PostPreview from '../components/post'
import api from "../services/api";
import axios from "axios";
import CommentForm from "../components/commentform";
import { Post } from "../components/post";
import {Reaction , DisplayReactionGroup} from "../components/reactions";
//import LoginModal from "../components/loginmodal";
import CommentPreview, {
  //PaginatedResponse,
  PostComment,
} from "../components/comment";



const PostPage: React.FC = () => {
  //User
  const { user: currentUser, accessToken} = useAuth();  
  // Post
  const { id: postId } = useParams<{ id: string }>();  
  const [post, setPost] = useState<Post | null>(null);
  const [loadingPost, setLoadingPost] = useState<boolean>(true);

  // Comments
  const [comments, setComments] = useState<PostComment[]>([]);
  const [loadingComments, setLoadingComments] = useState<boolean>(true);

  
  // Reactions
  const [allReactions, setAllReactions] = useState<Reaction[]>([]);
  const [loadingReactions, setLoadingReactions] = useState<boolean>(true);
  const [groupedReactions, setGroupedReactions] = useState<DisplayReactionGroup[]>([]);
  const [currentUserReaction, setCurrentUserReaction] = useState<Reaction | null>(null);
  const [isSubmittingReaction, setIsSubmittingReaction] = useState<boolean>(false);

  // Other
  //const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const AVAILABLE_REACTIONS = {
          DISLIKE : '👎',
          HEART : '❤️',
          LOL : '😂',
          CLOWN : '🤡',
          SHIT : '💩',
          NEUTRAL : '😐',
          TEARS : '😭',
          FEAR : '😱',
          ANGRY : '😡',
          FIRE : '🔥',
  };









  // -------------- POST LOADING --------------
  const fetchPost = async () => {
    if (!postId) {
      setLoadingPost(false);
      setError("ID none");
      return;
    }
    setLoadingPost(true);
    setError(null);

    try {
      const response = await api.get<Post>(`/posts/${postId}`);

      setPost(response.data);
      console.log(response.data);
    } catch (err) {
      console.error("error while loading post:", err);
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setError("post not found");
      } else {
        setError("error while loading post:");
      }
    } finally {
      setLoadingPost(false);
    }
  };


  // -------------- COMMENT LOADING --------------
  const fetchPostComments = async () => {
    if (!postId) {
      setLoadingComments(false);
      return;
    }
    setLoadingComments(true);
    try {
      const response = await api.get<PostComment[]>("/comments/", {
        params: { post: postId },
      });
      console.log("api response:", response.data);

      if (response.data && Array.isArray(response.data)) {
        setComments(response.data);
        console.log("first comment:", response.data[0]);
      } else {
        console.warn("API doesn't return array");
        setComments([]);
      }
    } catch (err) {
      console.error(" error while loading comments:", err);
    } finally {
      setLoadingComments(false);
    }
  };



  // -------------- REAACTION LOADING --------------
  const fetchReactions = useCallback(async () => {
    if (!postId || !post || typeof post.content_type_id === 'undefined') {
      if (post && typeof post.content_type_id === 'undefined') {console.warn("No content_type_id. Reactions cant be loaded");
      }
      setLoadingReactions(false);
      setAllReactions([]);
      setCurrentUserReaction(null);
      return;
    }

    setLoadingReactions(true);
    try {
      //const response = await api.get<PaginatedResponse<PostComment>>('/comments/', { params: { post: postId } });
      const response = await api.get<Reaction[]>("/reactions/", {
        params: { content_type: post.content_type_id, 
                  object_id: postId,   },
      });
      console.log("api response:", response.data);

      //if (response.data && Array.isArray(response.data.results)) { setComments(response.data.results); }
      if (response.data && Array.isArray(response.data)) {
        setAllReactions(response.data);
        if (currentUser) {
          const currentUserReaction = response.data.find((r) => r.user.id === currentUser.id);
          
          if (currentUserReaction) {
            setCurrentUserReaction(currentUserReaction);
            console.log('LOADED:', currentUserReaction);
            
          }
          else {
            setCurrentUserReaction(null);
            console.log('NOT LOADED UserReaction null:', currentUserReaction);
          }
        }

        
         
      } //else if (response.data && Array.isArray(response.data)){setAllReactions((response.data as any).results)} 
      else {
        console.warn("API doesn't return array");
        setAllReactions([]);
      }
    } catch (err) {
      console.error(" error while loading reactions:", err);
      setAllReactions([]);
    } finally {
      setLoadingReactions(false);
    }
  }, [postId, post])




//---------- REACTION HANDLER----------------

const handleReactionClick = async (clickedReactionType: string) => {
  if (
    !accessToken ||
    !currentUser ||
    !post ||
    typeof post.content_type_id === "undefined" ||
    isSubmittingReaction
  ) {
    if (!accessToken || !currentUser)
    alert("sign in!");
    
    return;
  }
  setIsSubmittingReaction(true);

  try {
    if (currentUserReaction) {
      
      if (currentUserReaction.reaction_type === clickedReactionType) {
        //console.log(`1`);
        await api.delete(`/reactions/${currentUserReaction.id}/`);
        setAllReactions((prev) =>
          prev.filter((r) => r.id !== currentUserReaction.id)
        );
      
      } else {
        //console.log('2');
        await api.delete(`/reactions/${currentUserReaction.id}/`);
        await api.post("/reactions/", {
          reaction_type: clickedReactionType,
          content_type: post.content_type_id,
          object_id: post.id,
        });
        // setAllReactions()
      }
    } else {
      //console.log('3');
      await api.post("/reactions/", {
        reaction_type: clickedReactionType,
        content_type: post.content_type_id,
        object_id: post.id,
      });
      // setAllReactions()
    }
    fetchReactions();
  } catch (err) {

    console.error("error sending reaction:", err);
    
    alert(`error sending reaction:" ${clickedReactionType} ID: ${currentUser.id}`);
  } finally {
    setIsSubmittingReaction(false);
  }
};
//---------------------






  //  -------------- RENDER --------------
  useEffect(() => {
    fetchPost();
  }, [postId]);

  useEffect(() => {
    fetchPostComments();
  }, [postId]);

    useEffect(() => {
      if (post) {
        fetchReactions();
      }
    
  }, [post, fetchReactions]);

  useEffect(() => {
  if (allReactions && allReactions.length > 0) {
    const summary: { [key: string]: DisplayReactionGroup } = {}; 

    allReactions.forEach(reaction => {
      if (!summary[reaction.reaction_type]) {
          summary[reaction.reaction_type] = {
          type: reaction.reaction_type,
          emoji: reaction.reaction_type_display, 
          count: 0,
          
        };
      }
      summary[reaction.reaction_type].count++;
    });

    const sortedGroups = Object.values(summary)
                              .filter(group => group.count > 0) 
                              .sort((a, b) => b.count - a.count); 

    setGroupedReactions(sortedGroups);
  } else {
    setGroupedReactions([]); 
  }
}, [allReactions]); 


  if (loadingPost) {
    return <p className="mt-16 p-4 text-center">loading post...</p>;
  }
  if (error && !post) {
    return <p className="mt-16 p-4 text-center text-red-500">error: {error}</p>;
  }
  if (!post) {
    return <p className="mt-16 p-4 text-center">post not fiund.</p>;
  }

  return (
    <React.Fragment>
      <main className="mt-16 p-4 space-y-8 bg-slate-100">
        <div className="mx-auto grid grid-cols-4">
          <div />
          <div className="col-span-2 bg-white shadow-2xl rounded-lg p-6 md:p-10">
            <h1 className="p-4 text-4xl font-bold text-black">{post.title}</h1>
            <div className="p-4 flex flex-row gap-x-3">
              <div className="text-sm text-indigo-500 hover:text-blue-400">
                {post.author?.profile?.nickname ||
                  `User ${post.author?.id}` ||
                  "User unknown"}
              </div>
              <div className="text-sm text-gray-500">
                posted{" "}
                {post.published_date
                  ? new Date(post.published_date).toLocaleDateString('en-EN', )
                  : "recently"}
              </div>
            </div>

            <div className="mt-4 p-4 text-lg prose max-w-none whitespace-pre-wrap">
              {/* if HTML, then dangerouslySetInnerHTML. if just simpl;e text {post.body} */}
              {post.body}
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-500">⭐ {post.rating}</p>
            </div>
            


        <div className="p-4 mt-4 border-t"> 
              <h3 className="text-md font-semibold mb-3 text-gray-700">your reaction:</h3>
              {loadingReactions && <p className="text-xs text-gray-400">loading...</p>}
              {!loadingReactions && (
                <div className="flex flex-wrap gap-2 items-center">
                  {Object.entries(AVAILABLE_REACTIONS).map(([reactionTypeKey, reactionEmoji]) => {
                   

                    const currentGroup = groupedReactions.find(g => g.type === reactionTypeKey);
                    const count = currentGroup ? currentGroup.count : 0;

                    const isActive = currentUserReaction?.reaction_type === reactionTypeKey;

                    return (
                      <button
                        key={reactionTypeKey}
                        onClick={() => handleReactionClick(reactionTypeKey)}
                        //disabled={!accessToken || isSubmittingReaction}
                        title={reactionTypeKey} 
                        className={`px-2.5 py-1 text-sm border rounded-full flex items-center space-x-1 transition-colors focus:outline-none
                                    ${isActive 
                                        ? 'bg-blue-500 text-white border-blue-600 hover:bg-blue-700 ring-2 ring-blue-300' 
                                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 hover:border-gray-400'}
                                    ${(!accessToken || isSubmittingReaction) ? 'cursor-not-allowed opacity-60' : ''}
                                `}
                      >
                        <span>{reactionEmoji}</span>
                        {count > 0 && <span className="font-medium text-xs">{count}</span>}
                      </button>
                    );
                  })}
                </div>
              )}
              
              {!loadingReactions && allReactions.length === 0 && !isSubmittingReaction && (<p className="text-xs text-gray-400 mt-2">no reactions yet.</p>)}
            </div>
            
          </div>

          <div />
        </div>
        <div>
          <section className="bg-white shadow-2xl rounded-lg p-6 md:p-10">
            
              {loadingComments && <h2 className="text-2xl font-semibold text-gray-800 mb-4">loading...</h2>}

              {!loadingComments && comments.length === 0 && (
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Start discussion</h2>
            )}
            {!loadingComments && comments.length >0 && (
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Comments ({comments.length})</h2>
            )}
              
            
            <div className="space-y-4 pb-6">
              <CommentForm />
            </div>

            <div className="space-y-4">
              {comments.map((comment) => (
                <CommentPreview key={comment.id} comment={comment} />
              ))}
            </div>
            {/* <AddCommentForm postId={post.id} onCommentAdded={(newComment) => setComments(prev => [newComment, ...prev])} /> */}
          </section>
        </div>
        {/*isModalOpen && <LoginModal onClose={() => setIsModalOpen(false)} />*/}
      </main>
    </React.Fragment>
  );
};

export default PostPage;
