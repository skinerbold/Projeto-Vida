import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async session({ session, token, user }: any) {
      if (session?.user && user) {
        session.user.id = user.id
      }
      return session
    },
    async jwt({ user, token }: any) {
      if (user) {
        token.uid = user.id
      }
      return token
    },
  },
  session: {
    strategy: 'database' as const,
  },
}
