import { useState, useEffect, useCallback } from "react";
import { Post } from "./post";
import { PostComment } from "./comment";
import { Reaction, DisplayReactionGroup } from "./reactions";
import { User } from "../context/AuthContext";
import api from "../services/api";
 



export const usePost = (postId: string | undefined) => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!postId) {
      setLoading(false);
      setError("Missing post ID");
      return;
    }

    setLoading(true);
    api
      .get<Post>(`/posts/${postId}`)
      .then((res) => setPost(res.data))
      .catch((err) => setError("Failed to load post"))
      .finally(() => setLoading(false));
  }, [postId]);

  return { post, loading, error };
};





export const usePostlist = () => {
  const [postList, setPostList] = useState<Post[]>([]);
  const [postListLoading, setPostListLoading] = useState(true);
  const [postListError, setPostListError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<Post[]>(`posts`)
      .then((res) => setPostList(res.data))
      .catch((err) => setPostListError("Failed to load posts"))
      .finally(() => setPostListLoading(false));
  }, []);
  return { postList, postListLoading, postListError };
};

export const useComments = (postId: string | undefined) => {
  const [comments, setComments] = useState<PostComment[]>([]);
  const [loadingComments, setLoadingComments] = useState<boolean>(true);

  useEffect(() => {
    if (!postId) {
      setLoadingComments(false);
      return;
    }

    setLoadingComments(true);
    api
      .get<PostComment[]>(`/comments/`, {
        params: { post: postId },
      })
      .then((res) => setComments(res.data))
      .catch((err) => console.error(" error while loading comments:", err))
      .finally(() => setLoadingComments(false));
  }, [postId]);

  return { comments, loadingComments };
};


export const useReactions = (
  postId: string | undefined,
  post: Post | null,
  currentUser: User | null,
  isSubmittingReaction: boolean
) => {
  const [allReactions, setAllReactions] = useState<Reaction[]>([]);
  const [loadingReactions, setLoadingReactions] = useState<boolean>(true);
  const [currentUserReaction, setCurrentUserReaction] =
    useState<Reaction | null>(null);

  const fetchReactions = useCallback(async () => {
    if (!postId || !post || typeof post.content_type_id === "undefined") {
      if (post && typeof post.content_type_id === "undefined") {
        console.warn("No content_type_id. Reactions cant be loaded");
      }
      setLoadingReactions(false);
      setAllReactions([]);
      setCurrentUserReaction(null);
      return;
    }

    setLoadingReactions(true);

    try {
      const response = await api.get<Reaction[]>("/reactions/", {
        params: { content_type: post.content_type_id, object_id: postId },
      });

      if (response.data && Array.isArray(response.data)) {
        setAllReactions(response.data);
        if (currentUser) {
          const currentUserReaction = response.data.find(
            (r) => r.user.id === currentUser.id
          );

          if (currentUserReaction) {
            setCurrentUserReaction(currentUserReaction);
            //console.log(currentUserReaction);
          } else {
            setCurrentUserReaction(null);
            //console.log("NOT LOADED UserReaction null:", currentUserReaction);
          }
        }
      } //else if (response.data && Array.isArray(response.data)){setAllReactions((response.data as any).results)}
      else {
        console.warn("API doesn't return array");
        setAllReactions([]);
      }
    } catch (err) {
      console.error(" error while loading reactions:", err);
      setAllReactions([]);
    } finally {
      setLoadingReactions(false);
    }
  }, [postId, post]);

  useEffect(() => {
    if (post) {
      fetchReactions();
    }
  }, [post, isSubmittingReaction, fetchReactions]);

  return { allReactions, loadingReactions, currentUserReaction };
};
 





export const useGroupReactions = (allReactions: Reaction[]) => {
  const [groupedReactions, setGroupedReactions] = useState<
    DisplayReactionGroup[]
  >([]);

  useEffect(() => {
    if (allReactions && allReactions.length > 0) {
      const summary: { [key: string]: DisplayReactionGroup } = {};
      allReactions.forEach((reaction) => {
        if (!summary[reaction.reaction_type]) {
          summary[reaction.reaction_type] = {
            type: reaction.reaction_type,
            emoji: reaction.reaction_type_display,
            count: 0,
            users: [],
          };
        }
        summary[reaction.reaction_type].count++;
        summary[reaction.reaction_type].users.push(reaction.user);
        //console.log(reaction.user);
      });

      const sortedGroups = Object.values(summary)
        .filter((group) => group.count > 0)
        .sort((a, b) => b.count - a.count);

      setGroupedReactions(sortedGroups);
      //console.log(sortedGroups);
    } else {
      setGroupedReactions([]);
    }
  }, [allReactions]);

  return groupedReactions;
};
