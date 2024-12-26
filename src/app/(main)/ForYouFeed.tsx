/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { PostData, PostsPage } from "@/lib/types";
import PostsLoadingSkeleton from "@/components/posts/PostLoadingSkeleton";
import Post from "@/components/posts/Post";
import kyInstance from "@/lib/ky";

export default function ForYouFeed() {
        
    const {
        data, fetchNextPage, hasNextPage, isFetching, isFetchNextPageError, status
    } = useInfiniteQuery({
        queryKey: ["post-feed", "for-you"],
        queryFn: ({ pageParam }) =>
            kyInstance
              .get(
                "/api/posts/for-you",
                pageParam ? { searchParams: { cursor: pageParam } } : {},
              )
              .json<PostsPage>(),
          initialPageParam: null as string | null,
          getNextPageParam: (lastPage) => lastPage.nextCursor,
    })

    const posts = data?.pages.flatMap((page) => page.posts) || [];

    if (status === "pending") {
        return <PostsLoadingSkeleton />;    
    }

    if (status === "error") {
        return (
            <p className="text-center text-destructive">
                An error occurred while loading posts.
            </p>
        );
    }

    return (
        <div className="space-y-5">
        {posts.map((post) => (
            <Post key={post.id} post={post} />
        ))}
        </div>
    )
}