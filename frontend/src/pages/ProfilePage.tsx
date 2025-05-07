import { useAuth } from '../context/AuthContext';
import LoginModal from '../components/loginmodal';
import React from 'react';

function ProfilePage() {
  return (
    <React.Fragment>
      <main className="mt-16 p-4 space-y-8">
        <h1 className="text-4xl font-bold">Welcome to ProfilePage, user</h1>
      </main>
    </React.Fragment>
  );
}

export default ProfilePage;
