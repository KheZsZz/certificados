import { FastifyReply, FastifyRequest } from 'fastify'
import { ROLE_HIERARCHY } from '@/configs/roles'

export function RoleMiddleware(minimumRoleRequired: string) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user as { id: string; role: string } | undefined

    if (!user) {
      return reply.status(401).send({ message: 'Não autenticado.' })
    }

    const userRoleLevel = ROLE_HIERARCHY[user.role] || 0
    const requiredRoleLevel = ROLE_HIERARCHY[minimumRoleRequired] || 0

    if (userRoleLevel < requiredRoleLevel) {
      return reply.status(403).send({
        message: 'Acesso negado: Seu cargo não possui o nível de permissão mínimo necessário.'
      })
    }
  }
}
