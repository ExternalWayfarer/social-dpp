import React, { useRef, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from 'react-router-dom';

import { Post } from "./post";

interface NewPostModalProps {
  // function for modal window closing
  onClose: () => void;
  onPostSuccess?: () => void;
}

const NewPostModal: React.FC<NewPostModalProps> = ({ onClose, onPostSuccess }) => {
    const modalRef = useRef<HTMLDivElement>(null); // link to modal window content
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { user, isLoading, accessToken } = useAuth();
    //const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="container mx-auto mt-20 p-4 text-center">
        <p className="text-gray-500 text-xl">loading...</p>
      </div>
    );
  }

  if (!accessToken || !user) {
    return (
      <div className="container mx-auto mt-20 p-4 text-center">
        <p className="text-red-500 text-xl">Please authorize.</p>
        <Link
          to="/login"
          className="text-blue-600 hover:underline mt-4 inline-block"
        >
          Post
        </Link>
      </div>
    );
  }






  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose(); // close modal
    }
  };


const handleNewPostSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

     try {
      await api.post("/posts/", {
        title: title,
        body: body,
        
      });
      console.log("post successful:");
      onClose();

      //callback
      if (onPostSuccess) {
        onPostSuccess();
      }

}catch (err: any) {
      console.error("Post failed:", err);
      if (err.response && err.response.status === 401) {
        setError("Wrong.");
      } else {
        setError("Error. Try later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-lg shadow-lg relative"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          &times;
        </button>

        

        <form onSubmit={handleNewPostSubmit}>
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <textarea
              
              id="title"
              name="title"
              rows={1}
              cols={20}
              className="mt-1 p-2 text-gray-700 w-full border rounded-md"
              placeholder="Name your post"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              
              
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Body
            </label>
            <textarea
              
              id="body"
              name="body"
              rows={10}
              
              className="mt-1 p-2 text-gray-700 w-full border rounded-md"
              placeholder="Write something"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Loading..." : "Post"}
          </button>
        </form>

      </div>
    </div>
  );
};

export default NewPostModal;
