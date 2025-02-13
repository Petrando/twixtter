/* eslint-disable @typescript-eslint/no-unused-vars */
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const fileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    imageUploader: f({
        image: {
            /**
             * For full list of options and defaults, see the File Route API reference
             * @see https://docs.uploadthing.com/file-routes#route-config
             */
            maxFileSize: "512KB",//"4MB",
            //maxFileCount: 1,
        },
    })
        // Set permissions and file types for this FileRoute
        .middleware(async ({ req }) => {
            // This code runs on your server before upload
            const {user} = await validateRequest();

            // If you throw, the user will not be able to upload
            if (!user) throw new UploadThingError("Unauthorized");

            // Whatever is returned here is accessible in onUploadComplete as `metadata`
            return { user };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            // This code RUNS ON YOUR SERVER after upload
            const oldAvatarUrl = metadata.user.avatarUrl;

            if (oldAvatarUrl) {
                const key = oldAvatarUrl.split(
                    `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
                )[1];

                await new UTApi().deleteFiles(key);
            }

            const newAvatarUrl = file.url.replace(
                "/f/",
                `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
              );

            await Promise.all([
                prisma.user.update({
                    where: { id: metadata.user.id },
                    data: {
                        avatarUrl: newAvatarUrl,
                    },
                }),
                streamServerClient.partialUpdateUser({
                    id: metadata.user.id,
                    set: {
                        image: newAvatarUrl,
                    },
                }),
            ]);
            
            // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
            return { avatarUrl: newAvatarUrl };
        }),
    attachment: f({
        image: { maxFileSize: "4MB", maxFileCount: 5 },
        video: { maxFileSize: "64MB", maxFileCount: 5 },
    })
        .middleware(async () => {
            const { user } = await validateRequest();
    
            if (!user) throw new UploadThingError("Unauthorized");
    
            return {};
        })
        .onUploadComplete(async ({ file }) => {
            const media = await prisma.media.create({
                data: {
                    url: file.url.replace(
                        "/f/",
                        `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
                    ),
                    type: file.type.startsWith("image") ? "IMAGE" : "VIDEO",
                },
            });
            return { mediaId: media.id };
        }),
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;
