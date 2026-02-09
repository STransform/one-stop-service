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
            if (account) {
                token.accessToken = account.access_token as string;
                token.idToken = account.id_token as string;

                // Extract roles
                const decoded = parseJwt(account.access_token as string);
                token.roles = decoded?.realm_access?.roles || [];
            }
            return token;
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken as string;
            session.roles = token.roles as string[];
            return session;
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
