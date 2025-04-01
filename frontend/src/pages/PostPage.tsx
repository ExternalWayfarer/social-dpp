import React from 'react';
import { useParams } from 'react-router-dom'
import PostPreview from '../components/post'


function PostPage() {
    const { id } = useParams();
    
    return (
        <React.Fragment>
      {/* Основной контент страницы */}
          <main className="mt-16 p-4 space-y-8">
      
    
            <PostPreview 
                key={id}
                author={author.email}
                title={title}
                text={text}

                />
    
          </main>
        </React.Fragment>
      );
    }



export default PostPage;