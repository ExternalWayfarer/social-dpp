// HomePage.tsx
import React from 'react';

import PostList from '../components/postlist';

function HomePage() {
  return (
    <React.Fragment>
  {/* Основной контент страницы */}
      <main className="mt-16 p-4 space-y-8">
        <h1 className="text-4xl font-bold">Welcome to HomePage</h1>
        <p className="mt-4 text-lg">
          Это главная страница вашего сайта. Здесь вы можете разместить информацию и элементы для отображения.
        </p>


        <PostList />

      </main>
    </React.Fragment>
  );
}

export default HomePage;
