import crypto from "crypto";
import { cookies, headers } from "next/headers";
import { getIPAddress } from "./location";
import { db } from "@/config/db";
import { sessions, users } from "@/drizzle/schema";
import { SESSION_LIFETIME, SESSION_REFRESH_TIME } from "@/config/constant";
import { eq } from "drizzle-orm";

type CreateSessionData = {
    token: string;
    userId: number;
    userAgent: string;
    ip: string;
    tx?: DbClient;
};


const generateSessionToken = () => {
    return crypto.randomBytes(32).toString("hex").normalize();
};

const createUserSession = async ({ token, userId, userAgent, ip, tx = db }: CreateSessionData) => {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const [session] = await tx.insert(sessions).values({
        id: hashedToken,
        userId,
        expiresAt: new Date(Date.now() + SESSION_LIFETIME * 1000),
        ip,
        userAgent,
    });

    return session;
}

type DbClient = typeof db | Parameters<Parameters<typeof db.transaction>[0]>[0];

export const createSessionsAndSetCookies = async (userId: number, tx: DbClient = db) => {
    const token = generateSessionToken();
    const ip = await getIPAddress();
    const headerList = await headers();

    await createUserSession({
        token,
        userId,
        userAgent: headerList.get("user-agent") || "",
        ip,
        tx
    });

    const cookieStore = await cookies();

    cookieStore.set(
        "session",
        token,
        {
            secure: true,
            httpOnly: true,
            maxAge: SESSION_LIFETIME,
        }
    );
}

export const validateSessionAndGetUser = async (session: string) => {
    const hashedToken = crypto.createHash("sha256").update(session).digest("hex");

    const [user] = await db
        .select({
            id: users.id,
            session: {
                id: sessions.id,
                expiresAt: sessions.expiresAt,
                userAgent: sessions.userAgent,
                ip: sessions.ip,
            },
            name: users.name,
            userName: users.userName,
            role: users.role,
            phoneNumber: users.phoneNumber,
            email: users.email,
            avatarUrl: users.avatarUrl,
            createdAt: users.createdAt,
            updatedAt: users.updatedAt,
        })
        .from(sessions)
        .where(eq(sessions.id, hashedToken))
        .innerJoin(users, eq(users.id, sessions.userId));

    if (!user) return null;

    if (Date.now() > new Date(user.session.expiresAt).getTime()) {
        await invalidateSession(user.session.id);
        return null;
    }

    if (Date.now() > new Date(user.session.expiresAt).getTime() - SESSION_REFRESH_TIME * 1000) {
        await db.update(sessions)
            .set({
                expiresAt: new Date(Date.now() + SESSION_LIFETIME * 1000),
            })
            .where(eq(sessions.id, user.session.id));
    }
    return user;

}

export const invalidateSession = async (sessionId: string) => {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
}