// HomePage.tsx
import React from 'react';

import PostList from '../components/postlist';

function HomePage() {
  return (
    <React.Fragment>
      <main className="mt-16 bg-slate-100">



        <PostList />

      </main>
    </React.Fragment>
  );
}

export default HomePage;
