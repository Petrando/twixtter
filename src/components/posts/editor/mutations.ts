/* eslint-disable @typescript-eslint/no-unused-vars */
import { useSession } from "@/app/(main)/SessionProvider";
import { useToast } from "@/hooks/use-toast";
import { PostsPage } from "@/lib/types";
import {
  InfiniteData,
  QueryFilters,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { submitPost } from "./action";

export function useSubmitPostMutation() {
    const { toast } = useToast();

    const queryClient = useQueryClient();

    const { user } = useSession();

    const mutation = useMutation({
        mutationFn: submitPost,
        onSuccess: async (newPost) => {
            const queryFilter:QueryFilters<InfiniteData<PostsPage, string | null>, Error, InfiniteData<PostsPage, string | null>, QueryKey> = 
                { 
                    queryKey: ["post-feed", "for-you"] 
                }            

            await queryClient.cancelQueries(queryFilter);
            
            queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
                queryFilter,
                (oldData) => {
                    const firstPage = oldData?.pages[0];

                    if (firstPage) {
                        return {
                            pageParams: oldData.pageParams,
                            pages: [
                                {
                                    posts: [newPost, ...firstPage.posts],
                                    nextCursor: firstPage.nextCursor,
                                },
                                ...oldData.pages.slice(1),
                            ],
                        };
                    }

                    queryClient.invalidateQueries({
                        queryKey: queryFilter.queryKey,
                        predicate(query) {
                            return !query.state.data;
                        },
                    });

                    toast({                        
                        description: "New post created.",
                    });
                },
            );
        },
        onError(error) {
            console.error(error);
            toast({
                variant: "destructive",
                description: "Failed to post. Please try again.",
            });
        },
    });

    return mutation;
}