"use server"
import { prisma } from "@/lib/db"
import {currentUser} from "@clerk/nextjs/server"

export const onBoardUser = async () => {
    try {
        const user = await currentUser();
        if(!user) {
            return {
                success: false,
                error: "User not authenticated"
            }
        }
        const { id, emailAddresses, firstName, lastName, imageUrl } = user
        const email = emailAddresses[0]?.emailAddress

        if (!email) {
            throw new Error("Authenticated user has no email address")
        }

        const existingUserByEmail = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if (existingUserByEmail) {
            await prisma.user.update({
                where: {
                    email
                },
                data: {
                    clerkId: id,
                    firstName: firstName || null,
                    lastName: lastName || null,
                    imageUrl: imageUrl || null
                }
            })
        } else {
            await prisma.user.upsert({
                where: {
                    clerkId: id
                },
                update: {
                    firstName: firstName || null,
                    lastName: lastName || null,
                    imageUrl: imageUrl || null,
                    email
                },
                create: {
                    clerkId: id,
                    firstName: firstName || null,
                    lastName: lastName || null,
                    imageUrl: imageUrl || null,
                    email
                }
            })
        }
    } catch (error) {
        console.error("Error onboarding user:", error)
        throw new Error("Failed to onboard user")
    }
}

export const currentUserRole = async () => { 
    try {
        const user = await currentUser();
        if(!user) {
            return {
                success: false,
                error: "User not authenticated"
            }
        }
        const { id } = user;
        const userRole = await prisma.user.findUnique({
            where: {
                clerkId: id
            }, 
            select: {
                role: true
            }
        });
        return userRole?.role;
    } catch (error) {
        console.error("Error fetching user role:", error)
        throw new Error("Failed to fetch user role")
    }
}

export const getCurrentUserData = async () => {
    try {
        const user = await currentUser();
        if(!user) {
            return {
                success: false,
                error: "User not authenticated"
            }
        }
        const { id} = user;
        const data = await prisma.user.findUnique({
            where: {
                clerkId: id
            },
            include: {
                submissions: true,
                solvedProblems: true,
                playlists: true
            }
        });
        return data;
    } catch (error) {
        console.error("Error fetching current user data:", error)
        throw new Error("Failed to fetch current user data")
    }
}