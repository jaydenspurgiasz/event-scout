import { jest } from '@jest/globals';

jest.unstable_mockModule('../models/db.js', () => ({
  createUser: jest.fn(),
  getUserByEmail: jest.fn(),
}));

jest.unstable_mockModule('bcrypt', () => ({
  default: {
    hashSync: jest.fn().mockReturnValue('hashed_password'),
    compareSync: jest.fn(),
  }
}));

jest.unstable_mockModule('jsonwebtoken', () => ({
  default: {
    sign: jest.fn().mockReturnValue('mock_token'),
  }
}));

const { createUser, getUserByEmail } = await import('../models/db.js');
const bcrypt = (await import("bcrypt")).default;
const jwt = (await import("jsonwebtoken")).default;
const { register, login } = await import('../controllers/authController.js');

describe('Auth Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('Register', () => {
    test('Register New User', async () => {
      req.body = {
        email: 'test@example.com',
        pass: 'password123',
        firstName: 'John',
        lastName: 'Doe'
      };
      createUser.mockResolvedValue(1);

      await register(req, res);

      expect(bcrypt.hashSync).toHaveBeenCalledWith('password123', 10);
      expect(createUser).toHaveBeenCalledWith(
        'test@example.com',
        'hashed_password',
        'John',
        'Doe'
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'User created' });
    });

    test('Register Existing User', async () => {
      req.body = {
        email: 'existing@example.com',
        pass: 'password123'
      };
      createUser.mockRejectedValue(new Error('Email exists'));

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Email already in use' });
    });
  });

  describe('Login', () => {
    test('Valid Login', async () => {
      req.body = {
        email: 'test@example.com',
        pass: 'password123'
      };
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashed_password'
      };
      getUserByEmail.mockResolvedValue(mockUser);
      bcrypt.compareSync.mockReturnValue(true);

      await login(req, res);

      expect(getUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(bcrypt.compareSync).toHaveBeenCalledWith('password123', 'hashed_password');
      expect(jwt.sign).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ token: 'mock_token' });
    });

    test('Invalid Email', async () => {
      req.body = {
        email: 'nonexistent@example.com',
        pass: 'password123'
      };
      getUserByEmail.mockResolvedValue(undefined);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid email or password' });
    });

    test('Invalid Password', async () => {
      req.body = {
        email: 'test@example.com',
        pass: 'wrongpassword'
      };
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashed_password'
      };
      getUserByEmail.mockResolvedValue(mockUser);
      bcrypt.compareSync.mockReturnValue(false);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid email or password' });
    });

    test('Server Error', async () => {
      req.body = {
        email: 'test@example.com',
        pass: 'password123'
      };
      getUserByEmail.mockRejectedValue(new Error('DB Error'));

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
  });
});
