import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import CommentForm from "../components/commentform";
import { AVAILABLE_REACTIONS } from "../components/reactions";
import CommentPreview from "../components/comment";
import { usePost, useComments, useGroupReactions, useReactions } from "../components/hooks";


const PostPage: React.FC = () => {
  const { user: currentUser, accessToken} = useAuth();  
  const { id: postId } = useParams<{ id: string }>();  
  const { post, loading, error } = usePost(postId);
  const {comments, loadingComments} = useComments(postId);
  const [isSubmittingReaction, setIsSubmittingReaction] = useState<boolean>(false);
  const {allReactions, loadingReactions, currentUserReaction} = useReactions(postId, post, currentUser, isSubmittingReaction)
  const groupedReactions = useGroupReactions(allReactions);




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

//----------------------------------------


  if (loading) {
    return <p className="mt-16 p-4 text-center">loading post...</p>;
  }
  if (error && !post) {
    return <p className="mt-16 p-4 text-center text-red-500">error: {error}</p>;
  }
  if (!post) {
    return <p className="mt-16 p-4 text-center">post not found.</p>;
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
            {/*<div className="p-4">
              <p className="text-sm text-gray-500">⭐ {post.rating}</p>
            </div>*/}
            


        <div className="p-4 mt-4 border-t"> 
              {loadingReactions && <p className="text-xs text-gray-400">loading...</p>}
              
                
                <div className="flex flex-wrap gap-2 items-center">
                  {allReactions.length > 0 && !loadingReactions 
                    ?
                    <div className="flex flex-wrap gap-2 items-center">
                      {groupedReactions.map((group) => (
                       
                        <div key={group.type} className="relative group cursor-pointer">
                          <button onClick={() => handleReactionClick(group.type)} 
                          title={group.type} 
                          disabled={!accessToken || isSubmittingReaction} 
                          className={`px-2.5 py-1 text-sm border rounded-full flex items-center space-x-1 transition-colors focus:outline-none ${currentUserReaction?.reaction_type === group.type ? 'bg-blue-500 text-white border-blue-600 hover:bg-blue-700 ring-2 ring-blue-300' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 hover:border-gray-400'   }`}
                          >
                          
                          <span className="">{group.emoji}</span>
                          <span className="text-xs font-medium">{group.count}</span>
                          
                          <div className="absolute z-10 left-0 top-full mt-1 w-40 bg-white border border-gray-300 rounded-xl shadow-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none group-hover:pointer-events-auto">
                            {group.users.map((user)=>(
                              <div className="text-sm text-black" key={user.id}>
                                {user.profile.nickname}
                              </div>
                            ))}
                            
                          </div>
                          </button>
                          
                        </div>
                       
                      ))}
                       
                        {accessToken && 
                        <div className="relative group cursor-pointer">
                        <span >➕</span>
                          <div className="absolute z-10 bottom-full mb-1 w-auto flex gap-x-2 text-black bg-white border border-gray-300 rounded-xl shadow-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-100 pointer-events-none group-hover:pointer-events-auto"  onMouseEnter={(e) => e.currentTarget.classList.add("opacity-100", "pointer-events-auto")} onMouseLeave={(e) => e.currentTarget.classList.remove("opacity-100", "pointer-events-auto", "delay-1000")}>
                            {Object.entries(AVAILABLE_REACTIONS).map(([reaction_type, reaction_type_display])=>(
                              <div onClick={()=> handleReactionClick(reaction_type)} className="cursor-pointer hover:scale-110" key={reaction_type}>
                                
                              {reaction_type_display}
                              </div>
                              
                            ))}
                          </div>
                          </div>
                        }
                          
                        

                    </div>

                    :<div className="flex flex-wrap gap-2 items-center"> 
                    <button>🩶</button>
                    </div>
                  }
                  
                </div>
              
              
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
