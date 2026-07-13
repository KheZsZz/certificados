import Fastify from 'fastify';
// modules
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import cookie from '@fastify/cookie';
import rateLimit from '@fastify/rate-limit';


//routes
import { appRoutes } from '@/routes/global.routes';

const app = Fastify({
  logger: true,
});

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') ?? ["http://localhost:3000"];

// Configuração do CORSs
app.register(cors, {
  origin: (origin, cb) => {
    if (!origin) {
      return cb(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      cb(null, true) // origem permitida
      return
    }
    cb(new Error("Bloqueado pelo CORS: Origem não autorizada."), false)
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});
app.register(rateLimit, {
  max: 100,
  timeWindow: '1m',
  errorResponseBuilder: (request, context) => {
    return {
      statusCode: 429,
      error: 'Too Many Requests',
      message: 'Muitas tentativas detectadas. Por favor, aguarde um minuto antes de tentar novamente.'
    }
  }
})
app.register(jwt, {
  secret: process.env.JWT_SECRET as string
});
app.register(cookie, {
  secret: process.env.COOKIE_SECRET,
  parseOptions: {}
})

app.register(appRoutes)


app.listen({ port: 3000 }, (err) => {
  console.log('Server is running on port: 3000')
});
