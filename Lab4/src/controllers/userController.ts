import { Request, Response } from 'express';
import { UserStore } from '../models/user';

const userStore = new UserStore();

export class UserController {
  // GET /api/users
  getAllUsers(req: Request, res: Response): void {
    try {
      const users = userStore.getAll();
      res.status(200).json({
        success: true,
        data: users,
        count: users.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching users'
      });
    }
  }

  // GET /api/users/:id
  getUserById(req: Request, res: Response): void {
    try {
      const id = parseInt(req.params.id);
      const user = userStore.getById(id);
      
      if (!user) {
        res.status(404).json({
          success: false,
          message: `User with id ${id} not found`
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching user'
      });
    }
  }

  // POST /api/users
  createUser(req: Request, res: Response): void {
    try {
      const { name, email } = req.body;

      if (!name || !email) {
        res.status(400).json({
          success: false,
          message: 'Name and email are required'
        });
        return;
      }

      const newUser = userStore.create(name, email);
      res.status(201).json({
        success: true,
        data: newUser,
        message: 'User created successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating user'
      });
    }
  }

  // PUT /api/users/:id
  updateUser(req: Request, res: Response): void {
    try {
      const id = parseInt(req.params.id);
      const { name, email } = req.body;

      if (!name || !email) {
        res.status(400).json({
          success: false,
          message: 'Name and email are required'
        });
        return;
      }

      const updatedUser = userStore.update(id, name, email);

      if (!updatedUser) {
        res.status(404).json({
          success: false,
          message: `User with id ${id} not found`
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: updatedUser,
        message: 'User updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating user'
      });
    }
  }

  // DELETE /api/users/:id
  deleteUser(req: Request, res: Response): void {
    try {
      const id = parseInt(req.params.id);
      const deleted = userStore.delete(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: `User with id ${id} not found`
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: `User with id ${id} deleted successfully`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting user'
      });
    }
  }
}
