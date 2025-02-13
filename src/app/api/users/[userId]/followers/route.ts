import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { FollowerInfo } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(
    req: NextRequest,
    { params}: { params: Promise<{ userId: string }> },
) {
    const { userId } = await params
    try {
        const { user: loggedInUser } = await validateRequest();

        if (!loggedInUser) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                followers: {
                    where: {
                        followerId: loggedInUser.id,
                    },
                    select: {
                        followerId: true,
                    },
                },
                _count: {
                    select: {
                        followers: true
                    },
                },
            },
        });
        
        if (!user) {
            return Response.json({ error: "User not found" }, { status: 404 });
        }

        const data: FollowerInfo = {
            followers: user._count.followers,
            isFollowedByUser: !!user.followers.length,
        };

        return Response.json(data);
    } catch (error) {
        console.error(error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}


export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
    const { userId } = await params 
    try {
        const { user: loggedInUser } = await validateRequest();

        if (!loggedInUser) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        await prisma.$transaction([
            prisma.follow.upsert({
                where: {
                    followerId_followingId: {
                        followerId: loggedInUser.id,
                        followingId: userId,
                    },
                },
                create: {
                    followerId: loggedInUser.id,
                    followingId: userId,
                },
                update: {},
            }),
            prisma.notification.create({
                data: {
                    issuerId: loggedInUser.id,
                    recipientId: userId,
                    type: "FOLLOW",
                },
            }),
        ]);

        return new Response();
    } catch (error) {
        console.error(error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
    const { userId } = await params
    try {
        const { user: loggedInUser } = await validateRequest();

        if (!loggedInUser) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        await prisma.$transaction([
            prisma.follow.deleteMany({
                //deleteMany instead of delete because if follow data does not exist, the deleteMany operation will
                //just return silently
                where: {
                    followerId: loggedInUser.id,
                    followingId: userId,
                },
            }),
            /*
            prisma.notification.deleteMany({
                where: {
                    issuerId: loggedInUser.id,
                    recipientId: userId,
                    type: "FOLLOW",
                },
            }),*/
        ]);

        return new Response();
    } catch (error) {
        console.error(error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}