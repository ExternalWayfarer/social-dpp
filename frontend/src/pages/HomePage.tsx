// HomePage.tsx
import React from 'react';

import PostList from '../components/postlist';

function HomePage() {
  return (
    <React.Fragment>
      <main className="mt-16 p-4 space-y-8">
        <h1 className="text-4xl font-bold"></h1>
        <p className="mt-4 text-lg">
          
        </p>


        <PostList />

      </main>
    </React.Fragment>
  );
}

export default HomePage;
