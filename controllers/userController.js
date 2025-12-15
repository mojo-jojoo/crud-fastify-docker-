import UserModel from '../models/userModel.js';

class UserController {
  // GET all users
  static async getUsers(request, reply) {
    try {
      const users = await UserModel.getAll();
      return reply.send({
        success: true,
        count: users.length,
        data: users
      });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // GET single user
  static async getUser(request, reply) {
    try {
      const { id } = request.params;
      const user = await UserModel.getById(id);
      
      if (!user) {
        return reply.status(404).send({
          success: false,
          error: 'User not found'
        });
      }
      
      return reply.send({
        success: true,
        data: user
      });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // POST create user
  static async createUser(request, reply) {
    try {
      const { name, email, age } = request.body;
      
      // Validation
      if (!name || !email) {
        return reply.status(400).send({
          success: false,
          error: 'Name and email are required'
        });
      }
      
      // Check email format (basic)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return reply.status(400).send({
          success: false,
          error: 'Invalid email format'
        });
      }
      
      // Check if email exists
      const emailExists = await UserModel.emailExists(email);
      if (emailExists) {
        return reply.status(400).send({
          success: false,
          error: 'Email already exists'
        });
      }
      
      const user = await UserModel.create({ name, email, age });
      
      return reply.status(201).send({
        success: true,
        message: 'User created successfully',
        data: user
      });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // PUT update user
  static async updateUser(request, reply) {
    try {
      const { id } = request.params;
      const { name, email, age } = request.body;
      
      // Check if user exists
      const existingUser = await UserModel.getById(id);
      if (!existingUser) {
        return reply.status(404).send({
          success: false,
          error: 'User not found'
        });
      }
      
      // Validation
      if (!name || !email) {
        return reply.status(400).send({
          success: false,
          error: 'Name and email are required'
        });
      }
      
      // Check email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return reply.status(400).send({
          success: false,
          error: 'Invalid email format'
        });
      }
      
      // Check if email exists for another user
      const emailExists = await UserModel.emailExists(email, id);
      if (emailExists) {
        return reply.status(400).send({
          success: false,
          error: 'Email already exists for another user'
        });
      }
      
      const user = await UserModel.update(id, { name, email, age });
      
      return reply.send({
        success: true,
        message: 'User updated successfully',
        data: user
      });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // DELETE user
  static async deleteUser(request, reply) {
    try {
      const { id } = request.params;
      
      // Check if user exists
      const existingUser = await UserModel.getById(id);
      if (!existingUser) {
        return reply.status(404).send({
          success: false,
          error: 'User not found'
        });
      }
      
      const deletedUser = await UserModel.delete(id);
      
      return reply.send({
        success: true,
        message: 'User deleted successfully',
        data: deletedUser
      });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        success: false,
        error: 'Internal server error'
      });
    }
  }
}

export default UserController;