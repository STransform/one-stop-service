import NextAuth from "next-auth";
import Keycloak from "next-auth/providers/keycloak";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Keycloak({
      clientId: process.env.KEYCLOAK_CLIENT_ID,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
      issuer: process.env.KEYCLOAK_ISSUER,
    }),
    Credentials({
      name: "Mock Login",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "mock" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        let role = "CITIZEN";
        let name = "Mock Citizen";
        const username = credentials?.username as string;

        if (username === "admin") {
          role = "ADMIN";
          name = "System Admin";
        } else if (username === "super_admin") {
          role = "SUPER_ADMIN";
          name = "Super Administrator";
        } else if (username === "officer") {
          role = "FRONT_OFFICER";
          name = "Front Desk Officer";
        } else if (username === "supervisor") {
          role = "SUPERVISOR";
          name = "Department Supervisor";
        } else if (username === "citizen") {
          role = "CITIZEN";
          name = "John Doe";
        }

        return {
          id: `mock-${username}-123`,
          name: name,
          email: `${username}@example.com`,
          role: role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // Initial sign in
      if (account && user) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
        token.id = user.id;
        token.role = user.role;
      }

      // Extract roles from Keycloak token
      if (account?.provider === 'keycloak' && account.access_token) {
        try {
          // Decode the JWT token to extract roles
          const payload = JSON.parse(
            Buffer.from(account.access_token.split('.')[1], 'base64').toString()
          );

          // Extract roles from resource_access or realm_access
          const clientId = process.env.KEYCLOAK_CLIENT_ID;
          let roles: string[] = [];

          // Try to get roles from resource_access first (client-specific roles)
          if (clientId && payload.resource_access?.[clientId]?.roles) {
            roles = payload.resource_access[clientId].roles;
          }
          // Fall back to realm_access roles
          else if (payload.realm_access?.roles) {
            roles = payload.realm_access.roles;
          }

          token.roles = roles;
        } catch (error) {
          console.error('Error extracting roles from Keycloak token:', error);
          token.roles = [];
        }
      }

      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.accessToken = token.accessToken;
      session.idToken = token.idToken;
      session.user.id = token.id;
      session.user.role = token.role;
      session.roles = token.roles || [];
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
});
