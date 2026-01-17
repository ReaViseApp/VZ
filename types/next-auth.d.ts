import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      username: string
      role: 'USER' | 'MODERATOR' | 'ADMIN'
    }
  }

  interface User {
    id: string
    email: string | null
    username: string
    role: 'USER' | 'MODERATOR' | 'ADMIN'
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    username: string
    email: string
    role: 'USER' | 'MODERATOR' | 'ADMIN'
  }
}
