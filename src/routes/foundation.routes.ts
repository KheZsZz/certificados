import { FastifyInstance } from 'fastify'
import { RoleMiddleware } from '@/middlewares/rolesMiddleware'
import { foundationService } from '@/services/foundationService'

import { FoundationCreateInput } from '@/generated/models' // types create

export async function foundationRoutes(fastify: FastifyInstance) {

  fastify.post('/foundations',
    { preHandler: [RoleMiddleware('DEVELOPERMENT')]},
    async (request, reply) => {
      const { name, document, manager } = request.body as FoundationCreateInput

      const foundation = await foundationService.create({ name, document, manager })
      return reply.status(201).send(foundation)
    }
  )
}
