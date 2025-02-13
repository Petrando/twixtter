/* eslint-disable @typescript-eslint/no-unused-vars */
import { useToast } from "@/hooks/use-toast";
import { useUploadThing } from "@/lib/uploadthing";
import { UpdateUserProfileValues } from "@/lib/validation";
import { InfiniteData, QueryFilters, QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { updateUserProfile } from "./action";
import { PostsPage } from "@/lib/types";

export function useUpdateProfileMutation(){
    const { toast } = useToast()

    const router = useRouter()

    const queryClient = useQueryClient()

    const { startUpload: startAvatarUpload } = useUploadThing("imageUploader")

    const mutation = useMutation({
        mutationFn: async ({
            values,
            avatar,
        }: {
            values: UpdateUserProfileValues;
            avatar?: File;
        }) => {
            return Promise.all([
                updateUserProfile(values),
                avatar && startAvatarUpload([avatar]),
            ]);
        },
        onSuccess: async ([updatedUser, uploadResult]) => {            
            
            const newAvatarUrl = uploadResult?.[0].serverData.avatarUrl;
      
            const queryFilter: QueryFilters<InfiniteData<PostsPage, string | null>, Error, InfiniteData<PostsPage, string | null>, QueryKey> = {
                queryKey: ["post-feed"],
            };
      
            await queryClient.cancelQueries(queryFilter);
      
            queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
                queryFilter,
                (oldData) => {
                    if (!oldData) return;
        
                    return {
                        pageParams: oldData.pageParams,
                        pages: oldData.pages.map((page) => ({
                            nextCursor: page.nextCursor,
                            posts: page.posts.map((post) => {
                                if (post.user.id === updatedUser.id) {
                                    return {
                                        ...post,
                                        user: {
                                            ...updatedUser,
                                            avatarUrl: newAvatarUrl || updatedUser.avatarUrl,
                                        },
                                    };
                                }
                                return post;
                            }),
                        })),
                    };
                },
            );
      
            router.refresh();
      
            toast({
                description: "Profile updated",
            });
        },
        onError(error) {
            console.error(error);
            toast({
                variant: "destructive",
                description: "Failed to update profile. Please try again.",
            });
        },
    })

    return mutation
}