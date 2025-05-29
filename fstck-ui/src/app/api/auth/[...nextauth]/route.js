import NextAuth from 'next-auth';
import { authOptions } from '@/libs/auth';

const handler = NextAuth(authOptions);

// The App Router needs method exports:
export { handler as GET, handler as POST };