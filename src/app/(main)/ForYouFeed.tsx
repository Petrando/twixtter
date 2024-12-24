/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useQuery } from "@tanstack/react-query";
import { PostData } from "@/lib/types";
import PostsLoadingSkeleton from "@/components/posts/PostLoadingSkeleton";
import Post from "@/components/posts/Post";

export default function ForYouFeed() {
    
    const query = useQuery<PostData[]>({
        queryKey: ["post-feed", "for-you"],
        queryFn: async () => {
            const res = await fetch("/api/posts/for-you")
            if(!res.ok){
                throw Error(`Request failed with status code ${res.status}`)
            }
            return res.json()
        }
    })

    if (query.status === "pending") {
        return <PostsLoadingSkeleton />;    
    }

    if (query.status === "error") {
        return (
            <p className="text-center text-destructive">
                An error occurred while loading posts.
            </p>
        );
    }

    return (
        <>
        {query.data.map((post) => (
            <Post key={post.id} post={post} />
        ))}
        </>
    )
}