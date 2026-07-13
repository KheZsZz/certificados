import { FastifyInstance } from 'fastify'
import { UserCreateInput } from '@/generated/models'
import { authService } from '@/services/authService'

export async function authRoutes(fastify: FastifyInstance) {

  fastify.post('/login', async (request, reply) => {
    try {
      const { email, password } = request.body as UserCreateInput
      const { user, accessToken, refreshToken } = await authService.login(email, password, fastify)

      reply.setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7
      })

      return reply.status(200).send({
        user,
        accessToken
      })

    } catch (error: any) {
      return reply.status(401).send({ message: error.message })
    }
  })
  fastify.post('/refresh', async (request, reply) => {
    const refreshToken = request.cookies.refreshToken

    if (!refreshToken) {
      return reply.status(401).send({ message: 'Refresh token ausente. Faça login novamente.' })
    }

    try {
      const { newAccessToken, newRefreshToken } = await authService.refreshSession(refreshToken, fastify)

      reply.setCookie('refreshToken', newRefreshToken, {
        path: '/',
        secure: true,
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7
      })

      return reply.status(200).send({ accessToken: newAccessToken })

    } catch (error) {
      return reply.status(401).send({ message: 'Sessão inválida ou expirada.' })
    }
  })
  fastify.post('/logout', async (request, reply) => {
    reply.clearCookie('refreshToken', {
      path: '/',
      secure: true,
      httpOnly: true,
      sameSite: 'lax',
    })
    return reply.status(200).send({ message: 'Logout realizado com sucesso.' })
  })

}
