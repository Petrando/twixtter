import { PostsPage } from "@/lib/types";
import {
    InfiniteData,
    QueryFilters,
    QueryKey,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { deletePost } from "./action";

export function useDeletePostMutation() {
    const { toast } = useToast();

    const queryClient = useQueryClient();

    const router = useRouter();
    const pathname = usePathname();

    const mutation = useMutation({
        mutationFn: deletePost,
        onSuccess: async (deletedPost) => {
            const queryFilter: QueryFilters<InfiniteData<PostsPage, string | null>, Error, InfiniteData<PostsPage, string | null>, QueryKey> = 
                { queryKey: ["post-feed"] };

            await queryClient.cancelQueries(queryFilter);

            queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
                queryFilter,
                (oldData) => {
                    if (!oldData) return;

                    return {
                        pageParams: oldData.pageParams,
                        pages: oldData.pages.map((page) => ({
                            nextCursor: page.nextCursor,
                            posts: page.posts.filter((p) => p.id !== deletedPost.id),
                        })),
                    };
                },
            );

            toast({
                description: "Post deleted",
            });

            if (pathname === `/posts/${deletedPost.id}`) {
                router.push(`/users/${deletedPost.user.username}`);
            }
        },
        onError(error) {
            console.error(error);
            toast({
                variant: "destructive",
                description: "Failed to delete post. Please try again.",
            });
        },
    });

    return mutation;
}