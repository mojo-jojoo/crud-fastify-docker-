import UserController from '../controllers/userController.js';

async function userRoutes(fastify, options) {
  // GET all users
  fastify.get('/users', UserController.getUsers);
  
  // GET single user
  fastify.get('/users/:id', UserController.getUser);
  
  // POST create user
  fastify.post('/users', UserController.createUser);
  
  // PUT update user
  fastify.put('/users/:id', UserController.updateUser);
  
  // DELETE user
  fastify.delete('/users/:id', UserController.deleteUser);
  
  // Health check
  fastify.get('/health', async (request, reply) => {
    return { status: 'OK', timestamp: new Date().toISOString() };
  });
}

export default userRoutes;