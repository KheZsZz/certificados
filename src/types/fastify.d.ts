import '@fastify/jwt'

declare module 'fastify' {
  interface FastifyRequest {
    user: {
      id: string
      email: string
      role: 'DEVELOPERMENT' | 'ADM' | 'FINANCER' | 'SECRETARY' | 'TEACHER' | 'STUDENT' // roles users
    }
  }
}
