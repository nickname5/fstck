import jwt from 'jsonwebtoken';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
  jwt: { encryption: false },
  callbacks: {
    async jwt({ token, account, user }) {
      // First sign-in only (we just came back from Google)
      if (account && user) {
        const res = await fetch(
          `${process.env.USER_SERVICE_URL}/user/resolve/${user.id}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          },
        );

        const { userId } = await res.json();

        token.gatewayJwt = jwt.sign(
          { userId },
          process.env.NEXTAUTH_SECRET,
          { algorithm: 'HS512', /* expiresIn: '15m' */ }
        );
      }

      return token;
    },
    async session({ session, token }) {
      session.gatewayJwt = token.gatewayJwt;
      return session;
    },
  },
};