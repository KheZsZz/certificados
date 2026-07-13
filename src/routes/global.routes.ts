import { FastifyInstance } from 'fastify';
import { RoleMiddleware } from '@/middlewares/rolesMiddleware'

//routes
import { foundationRoutes } from '@/routes/foundationRoutes';


export async function appRoutes(fastify: FastifyInstance) {


  fastify.register(
    foundationRoutes,
    { prefix: '/foundations',
      // preHandler: [RoleMiddleware('DEVELOPERMENT')]
    }
  )


}
