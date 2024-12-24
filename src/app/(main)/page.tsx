/* eslint-disable @typescript-eslint/no-unused-vars */
import PostEditor from "@/components/posts/editor/PostEditor";
import Post from "@/components/posts/Post";
import TrendsSidebar from "@/components/TrendsSidebar";
import prisma from "@/lib/prisma"
import { postDataInclude } from "@/lib/types";
import dynamic from "next/dynamic";
import ForYouFeed from "./ForYouFeed";

export default function Home() {
  
  return (    
      <main className="w-full min-w-0 flex">
        <div className="w-full min-w-0 space-y-5">
          <PostEditor />
          <ForYouFeed />
        </div>
        <TrendsSidebar />
      </main>         
  );
}
