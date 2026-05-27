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
        await prisma.user.upsert({
            where: {
                clerkId: id
            },
            update: {
                firstName: firstName || null,
                lastName: lastName || null,
                imageUrl: imageUrl || null,
                email: emailAddresses[0]?.emailAddress || ""
            },
            create: {
                clerkId: id,
                firstName: firstName || null,
                lastName: lastName || null,
                imageUrl: imageUrl || null,
                email: emailAddresses[0]?.emailAddress || ""
            }
        });
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
        return userRole?.role || "USER";
    } catch (error) {
        console.error("Error fetching user role:", error)
        throw new Error("Failed to fetch user role")
    }
}

// export const getCurrentUserData = async () => {
//     try {
//         const user = await currentUser();
//         if(!user) {
//             return {
//                 success: false,
//                 error: "User not authenticated"
//             }
//         }
//         const { id} = user;
//         const userData = await prisma.user.findUnique({
//             where: {
//                 clerkId: id
//             },
//             select: {
//                 firstName: true,
//                 lastName: true,
//                 imageUrl: true,
//                 email: true
//             }
//         });
//         return {
//             success: true,
//             data: userData
//         };
//     } catch (error) {
//         console.error("Error fetching current user data:", error)
//         throw new Error("Failed to fetch current user data")
//     }
// }