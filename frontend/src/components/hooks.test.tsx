// hooks/usePost.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { usePost } from './hooks';
import api from '../services/api';
import { describe, it, expect, vi } from "vitest";

vi.mock('../services/api');

const TestComponent = ({ postId }: { postId: string }) => {
  const { post, loading, error } = usePost(postId);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {post && <p>Post: {post.title}</p>}
    </div>
  );
};

describe('usePost', () => {
  it('it shows after loading', async () => {
    const fakePost = { id: 1, title: 'Test Post', body: '...' };
    (api.get as any).mockResolvedValueOnce({ data: fakePost });

    render(<TestComponent postId="1" />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => screen.getByText(/test post/i));
  });

  it('it shows error after failing request', async () => {
    (api.get as any).mockRejectedValueOnce(new Error("fail"));

    render(<TestComponent postId="1" />);

    await waitFor(() => screen.getByText(/error/i));
  });
});
