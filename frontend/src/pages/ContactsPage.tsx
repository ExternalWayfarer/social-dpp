import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PostComponent from "../components/post_t";



const PostPage: React.FC = () => {
  //User
  //const { user: currentUser, accessToken} = useAuth();  
  // Post

  
  // Reactions
  


  // Other






//---------- REACTION HANDLER----------------






  return (
    <React.Fragment>
      <main className="mt-16 p-4 space-y-8 bg-slate-100">
        <div className="mx-auto grid grid-cols-4">
          <div />
          
          <p>mesto dalya posta</p>
          <div />
          <PostComponent post={post} />
        </div>
       
        {/*isModalOpen && <LoginModal onClose={() => setIsModalOpen(false)} />*/}
      </main>
    </React.Fragment>
  );
};

export default PostPage;
