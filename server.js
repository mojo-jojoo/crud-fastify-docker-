import fastify from 'fastify';
import userRoutes from './routes/userRoutes.js';
import { testConnection } from './config/db.js';
import 'dotenv/config';

// Create Fastify instance
const app = fastify({ 
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname'
      }
    }
  }
});

// Test database connection
await testConnection();

// Register routes
app.register(userRoutes, { prefix: '/api' });

// Root route
app.get('/', async (request, reply) => {
  return {
    message: '🚀 Fastify CRUD API with PostgreSQL',
    version: '1.0.0',
    documentation: '/api/users',
    health: '/api/health'
  };
});

// 404 handler
app.setNotFoundHandler((request, reply) => {
  reply.status(404).send({
    success: false,
    error: 'Route not found',
    path: request.url
  });
});

// Error handler
app.setErrorHandler((error, request, reply) => {
  request.log.error(error);
  reply.status(error.statusCode || 500).send({
    success: false,
    error: error.message || 'Internal server error'
  });
});

// Start server
const start = async () => {
  try {
    const port = parseInt(process.env.PORT) || 3000;
    const host = process.env.HOST || '0.0.0.0';
    
    await app.listen({ port, host });
    
    console.log('\n' + '='.repeat(50));
    console.log('🚀 Server started successfully!');
    console.log(`📡 URL: http://localhost:${port}`);
    console.log(`📖 API Documentation: http://localhost:${port}/api/users`);
    console.log('='.repeat(50) + '\n');
    
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  app.log.info('Shutting down server...');
  await app.close();
  process.exit(0);
});

// Start the application
start();