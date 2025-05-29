import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import LoginModal from "./loginmodal";
import { useNavigate } from "react-router-dom";
//import Dropdown from './dropdown';
import SearchBar from "./searchbar";

const Header = () => {
  //const [isSearchVisible, setSearchVisible] = useState(false);
  let sign_in = "";
  const { accessToken, logout, user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  if (accessToken) {
    sign_in = "Profile";
  } else {
    sign_in = "Sign In";
  }
  const handleAccountClick = () => {
    if (accessToken) {
      navigate("/profile"); // to profile IF logged in
    } else {
      setIsModalOpen(true); // open modal window if not
    }
  };

  return (
    <header className="bg-gray-700 text-white fixed w-full top-0 left-0 shadow-md z-50">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        {/* logo */}
        <div className="flex items-center space-x-4">
          <a href="/" className="text-2xl font-bold hover:text-blue-300">
            X
          </a>

          <SearchBar />
        </div>
        {/* navigariob */}
        <nav className="flex items-center space-x-5">
          {/* <Dropdown />*/}

          <button onClick={handleAccountClick} className="hover:text-blue-300">
            {sign_in}
          </button>

          <a href="/about" className="hover:text-blue-400">
            About
          </a>
          <a href="/contacts" className="hover:text-blue-400">
            Contacts
          </a>
          <a href="/users" className="hover:text-blue-400">
            Users
          </a>
          <button onClick={handleAccountClick} className="hover:text-blue-300">
            Log Out
          </button>
        </nav>
      </div>
      {isModalOpen && <LoginModal onClose={() => setIsModalOpen(false)} />}
    </header>
  );
};

export default Header;
