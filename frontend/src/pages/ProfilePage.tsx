import { useAuth } from "../context/AuthContext";
import React, {useState, useEffect} from "react";
//import LoginModal from "../components/loginmodal";
import { Link, useNavigate } from 'react-router-dom';
import { Post } from "../components/post";




const ProfilePage: React.FC = () => {
  const { user, isLoading, logout, accessToken } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loadingPost, setLoadingPost] = useState<boolean>(true);


  if (isLoading) {
    return (
      <div className="container mx-auto mt-20 p-4 text-center">
        <p className="text-gray-500 text-xl">Profile loading...</p>
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
          Login
        </Link>
      </div>
    );
  }

  const { email, date_joined, is_staff, is_superuser, groups } = user;
  const { nickname, user_bio, user_avatar } = user.profile || {
    nickname: null,
    user_bio: null,
    user_avatar: null,
  };
  let avatarUrl = user_avatar;
  if (
    user_avatar &&
    !user_avatar.startsWith("http") &&
    !user_avatar.startsWith("/media/")
  ) {
    // if "avatars/image.jpg", but Django gives /media/avatars/image.jpg
    // avatarUrl = `http://localhost:8000/media/${user_avatar}`; or avatarUrl = `http://localhost:8000${user_avatar}`;
  } else if (user_avatar && user_avatar.startsWith("/media/")) {
    avatarUrl = `http://localhost:8000${user_avatar}`;
  }


const handleLogout = () => {
    logout(); 
    navigate('/'); 
  };


/*
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
*/


  return (
    <main>
      <div className="container mx-auto mt-20 px-4 py-2 max-w-3xl">
        <div className="bg-white shadow-2xl rounded-lg mb-4 p-2 md:p-10">
          <div className="flex flex-col items-center md:flex-row md:items-start md:space-x-8">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={nickname || email}
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-gray-200 shadow-md"
              />
            ) : (
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 text-5xl font-semibold mb-4 md:mb-0">
                {(nickname || email || "U").charAt(0).toUpperCase()}
              </div>
            )}

            <div className="mt-4 md:mt-0 text-center md:text-left flex-grow">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-1">
                {nickname || "User"}
              </h1>
              <p className="text-md text-gray-600 mb-3">{email}</p>
              <p className="text-sm text-gray-500">
                With us since:{" "}
                {new Date(date_joined).toLocaleDateString("en-EN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <div className="flex space-x-4">
                <div className="mt-4">
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-sm transition duration-150">
                    <Link to="/profile/edit">Edit</Link>
                  </button>
                </div>
                <div className="mt-4">
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg text-sm transition duration-150"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>

          {user_bio && (
            <div className="mt-8 border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-3">
                About:
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {user_bio}
              </p>
            </div>
          )}

          <div className="mt-8 border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">
              Status:
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {is_staff && <li>Staff</li>}
              {is_superuser && <li>SuperUser</li>}
              {groups && groups.length > 0 && (
                <li>Groups: {groups.join(", ")}</li>
              )}
              {!is_staff &&
                !is_superuser &&
                (!groups || groups.length === 0) && <li>Regular user</li>}
            </ul>
          </div>
        </div>
        <div className="bg-white shadow-2xl rounded-lg mb-4 p-2 md:p-10">
          <div className="flex space-x-4">
            <div className="mt-2">
              <button className="bg-white  hover:bg-slate-100 hover:shadow-sm text-black font-semibold py-2 px-4 rounded-lg text-sm transition duration-250">
                Posts
              </button>
            </div>
            <div className="mt-2">
              <button className="bg-white hover:bg-slate-100 hover:shadow-sm text-black font-semibold py-2 px-4 rounded-lg text-sm transition duration-250">
                Comments
              </button>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Latest:</h4>
          </div>
        </div>
        <div className="bg-white shadow-2xl rounded-lg mb-4 p-2 md:p-10">
                <p>posts</p>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
