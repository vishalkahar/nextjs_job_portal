"use server";

import { db } from "@/config/db";
import { getCurrentUser } from "../auth/server/auth.queries";
import { employers, users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { EmployerProfileData } from "../employers/employers.schema";

export const updateEmployerProfileAction = async (
    data: EmployerProfileData
) => {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser || currentUser.role !== "employer") {
            return { status: "ERROR", message: "Unauthorized" };
        }

        const {
            name,
            description,
            yearOfEstablishment,
            location,
            websiteUrl,
            organizationType,
            teamSize,
            avatarUrl,
            bannerImageUrl,
        } = data;

        await db
            .update(employers)
            .set({
                name,
                description,
                location,
                websiteUrl,
                organizationType,
                teamSize,
                bannerImageUrl,
                yearOfEstablishment: yearOfEstablishment
                    ? parseInt(yearOfEstablishment)
                    : null,
            })
            .where(eq(employers.id, currentUser.id));

        await db
            .update(users)
            .set({
                avatarUrl,
            })
            .where(eq(users.id, currentUser.id));

        return { status: "SUCCESS", message: "Profile updated successfully" };
    } catch (error) {
        return {
            status: "ERROR",
            message: "Something went wrong, please try again",
        };
    }
};