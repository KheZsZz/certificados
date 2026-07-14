import { FastifyInstance } from 'fastify'
import { userService } from '@/services/userService'

import { UserCreateInput } from '@/generated/models' // types create

export async function usersRoutes(fastify: FastifyInstance) {

  fastify.post('/',
    async (request, reply) => {
      try {
        const userData: UserCreateInput = request.body as UserCreateInput
        const user = await userService.create(userData)
        reply.status(201).send(user)
      } catch (error: any) {
        reply.status(500).send({ error: error.message || 'Failed to create user' })
      }
    }
  )

  fastify.get('/',
    async (request, reply) => {
      try {
        const users = await userService.findAll()
        reply.status(200).send(users)
      } catch (error: any) {
        reply.status(500).send({ error: error.message || 'Failed to fetch users' })
      }
    }
  )

  fastify.put('/:id',
    async (request, reply) => {
      try {
        const { id } = request.params as { id: string }
        const userData: UserCreateInput = request.body as UserCreateInput
        const user = await userService.update(id, userData)
        reply.status(200).send(user)
      } catch (error: any) {
        reply.status(500).send({ error: error.message || 'Failed to update user' })
      }
    }
  )
}
