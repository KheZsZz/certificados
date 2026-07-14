import { FastifyInstance } from 'fastify';
import { authMiddleware } from '@/middlewares/authMidlleware';
import { RoleMiddleware } from '@/middlewares/rolesMiddleware'

//routes
import { authRoutes } from './auth.routes';
import { foundationRoutes } from '@/routes/foundation.routes';
import { usersRoutes } from '@/routes/users.routes';

export async function appRoutes(fastify: FastifyInstance) {

  fastify.register(authRoutes, { prefix: '/auth' })


  fastify.register( foundationRoutes,
    { 
      prefix: '/foundations',
      preHandler: [authMiddleware, RoleMiddleware('DEVELOPERMENT')]
    }
  )

  fastify.register(usersRoutes,
    { 
      prefix: '/users',
      preHandler: [authMiddleware, RoleMiddleware('ADM')]
    }
  )


}
