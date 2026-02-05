"use server";
import { db } from "@/config/db";
import { applicants, employers, users } from "@/drizzle/schema";
import argon2 from "argon2";
import crypto from "crypto";
import { eq, or } from "drizzle-orm";
import { LoginUserData, loginUserSchema, RegisterUserData, registerUserSchema } from "../auth.schema";
import { createSessionsAndSetCookies, invalidateSession } from "./use-cases/sessions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const registrationAction = async (data: RegisterUserData) => {
    try {
        const { data: validatedData, error } = registerUserSchema.safeParse(data);
        if (error) {
            return {
                status: "ERROR",
                message: error.issues[0].message,
            }
        }
        const { name, userName, email, password, role } = validatedData;

        const [user] = await db.select().from(users).where(or(eq(users.userName, userName), eq(users.email, email)));

        if (user) {
            if (user.email === email) {
                return {
                    status: "ERROR",
                    message: "Email already exists",
                }
            } else {
                return {
                    status: "ERROR",
                    message: "Username already exists",
                }
            }
        }
        const hashPassword = await argon2.hash(password);

        await db.transaction(async (tx) => {
            const [result] = await tx.insert(users).values({ name, userName, email, password: hashPassword, role });

            if (role === "applicant") {
                await tx.insert(applicants).values({ id: result.insertId })
            } else {
                await tx.insert(employers).values({ id: result.insertId })
            }
            await createSessionsAndSetCookies(result.insertId, tx);
        });

        return {
            status: "SUCCESS",
            message: "Registration completed successfully",
        }
    } catch (error) {
        return {
            status: "ERROR",
            message: "Registration failed",
        }
    }
}

export const loginAction = async (data: LoginUserData) => {
    try {
        const { data: validatedData, error } = loginUserSchema.safeParse(data);
        if (error) {
            return {
                status: "ERROR",
                message: error.issues[0].message,
            }
        }
        const { email, password } = validatedData;

        const [user] = await db.select().from(users).where(eq(users.email, email));

        if (!user) {
            return {
                status: "ERROR",
                message: "Invalid Email or Password",
            }
        }
        if (!user.password || typeof user.password !== 'string' || !user.password.startsWith('$')) {
            console.error('Login Error: stored password is missing or not a valid hash', { id: user.id, email: user.email });
            return {
                status: "ERROR",
                message: "Invalid Email or Password",
            }
        }

        const isValidPassword = await argon2.verify(user.password, password);

        if (!isValidPassword) {
            return {
                status: "ERROR",
                message: "Invalid Email or Password",
            }
        }

        await createSessionsAndSetCookies(user.id);

        return {
            status: "SUCCESS",
            message: "Login Successful",
        }
    } catch (error) {
        console.error("Login Error:", error);
        return {
            status: "ERROR",
            message: "Unknown Error Occurred! Please try again later.",
        }
    }
}

export const logoutUserAction = async () => {
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;

    if (!session) return redirect("/login");

    const hashedToken = crypto.createHash("sha256").update(session).digest("hex");
    await invalidateSession(hashedToken);
    cookieStore.delete("session");

    return redirect("/login");
}