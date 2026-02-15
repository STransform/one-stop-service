import { NextAuthOptions } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";
import { parseJwt } from "@/lib/jwt";

export const authOptions: NextAuthOptions = {
    providers: [
        KeycloakProvider({
            clientId: process.env.KEYCLOAK_CLIENT_ID!,
            clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
            issuer: process.env.KEYCLOAK_ISSUER!,
        }),
    ],
    callbacks: {
        async jwt({ token, account }) {
            // Initial sign in
            if (account) {
                token.accessToken = account.access_token as string;
                token.idToken = account.id_token as string;
            }

            // Extract roles on every call to ensure they are up to date
            const accessToken = (account?.access_token as string) || (token.accessToken as string);

            if (accessToken) {
                try {
                    const decoded = parseJwt(accessToken);
                    const clientId = process.env.KEYCLOAK_CLIENT_ID;
                    const roles: string[] = [];

                    // to Debug logs
                    console.log("Debug: Processing JWT");
                    // Only log if we have decoded data to avoid spamming
                    if (decoded) {
                        // console.log("Debug: Decoded JWT:", JSON.stringify(decoded, null, 2)); 
                    }
                    console.log("Debug: Client ID:", clientId);

                    if (decoded?.realm_access?.roles) {
                        roles.push(...decoded.realm_access.roles);
                    }

                    if (clientId && decoded?.resource_access?.[clientId]?.roles) {
                        roles.push(...decoded.resource_access[clientId].roles);
                    }

                    const finalRoles = Array.from(new Set(roles));
                    token.roles = finalRoles;
                    console.log("Debug: Final Roles:", finalRoles);
                } catch (error) {
                    console.error("Error parsing JWT or extracting roles:", error);
                    token.roles = [];
                }
            }
            return token;
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken as string;
            session.roles = token.roles as string[];
            return session;
        },
        async redirect({ url, baseUrl }) {
            // If the url is the base url, redirect to /admin
            if (url === baseUrl) {
                return `${baseUrl}/admin`;
            }
            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`;
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) return url;
            return baseUrl;
        },
    },
    events: {
        async signOut({ token }) {
            if (token.idToken) {
                const issuerUrl = process.env.KEYCLOAK_ISSUER;
                const logOutUrl = new URL(`${issuerUrl}/protocol/openid-connect/logout`);
                logOutUrl.searchParams.set("id_token_hint", token.idToken as string);
                await fetch(logOutUrl);
            }
        },
    }
};
