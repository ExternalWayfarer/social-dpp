// hooks/usePost.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import PostComponent from './post';
import { Post } from './post';
import api from '../services/api';
import { describe, it, expect, vi } from "vitest";

vi.mock('../services/api');





const fakePost: Post = {
  id: 1,
  title: 'Test title',
  body: 'Test body',
  author: {
    id: 0,
    profile: {
    nickname: "John User"
    }
  },
  topic: null,
  status: 'PB',
  published_date: '10:10:10 12.12.12',
  time_created_at: '10:10:10 12.12.12',
  time_updated_at: '10:10:10 12.12.12',
  comments_count: 0,
  rating: 100,
  content_type_id: 1
}

const TestComponent: React.FC = () => {
  

  return (
    <div>
      <PostComponent post={fakePost} />
    </div>
  );
};

describe('PostComponent', () => {
  it('test check', () => {
    render(<TestComponent />);

    expect(screen.getByText(/Test title/i)).toBeInTheDocument();
    expect(screen.getByText(/test body/i)).toBeInTheDocument();
    expect(screen.getByText(/john user/i)).toBeInTheDocument();
    expect(screen.queryByText(/PB/i)).not.toBeInTheDocument();
    expect(screen.getByText(/12\/12\/2012/i)).toBeInTheDocument();
    expect(screen.getByText(/rating/i)).toBeInTheDocument()
     //waitFor(() => screen.getByText(/test post/i));
  });

});
