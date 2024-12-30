/* eslint-disable @typescript-eslint/no-unused-vars */
import { validateRequest } from "@/auth";
import TrendsSidebar from "@/components/TrendsSidebar";
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import { notFound } from "next/navigation";
import { cache } from "react";

interface PageProps {
    params: { username: string }; // Ensure params is a plain object with username as a string
}

const getUser = cache(async (username: string, loggedInUserId: string) => {
    const user = await prisma.user.findFirst({
        where: {
            username: {
                equals: username,
                mode: "insensitive",
            },
        },
        select: getUserDataSelect(loggedInUserId),
    });

    if (!user) notFound();

    return user;
});

export default async function Page({ params }: PageProps) {
    // params is directly destructured as { username }
    const { username } = params;

    // Validate request (login check)
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
        return (
            <p className="text-destructive">
                You&apos;re not authorized to view this page.
            </p>
        );
    }

    // Get the user data based on the username
    const user = await getUser(username, loggedInUser.id);

    return (
        <main className="flex w-full min-w-0 gap-5">
            <div className="w-full min-w-0 space-y-5">
                {/*...some components here....*/}
            </div>
            <TrendsSidebar />
        </main>
    );
}
