import { jest } from '@jest/globals';

jest.unstable_mockModule('../models/userModel.js', () => ({
  createUser: jest.fn(),
  getUserByEmail: jest.fn(),
  getUserById: jest.fn(),
  getAuthCredentials: jest.fn(),
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

const { createUser, getUserByEmail, getAuthCredentials } = await import('../models/userModel.js');
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
      cookie: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('Register', () => {
    // Successfully register a new user
    test('Register New User', async () => {
      req.body = {
        email: 'test@example.com',
        pass: 'password123',
        name: 'John'
      };
      createUser.mockResolvedValue(1);

      await register(req, res);

      expect(bcrypt.hashSync).toHaveBeenCalledWith('password123', 10);
      expect(createUser).toHaveBeenCalledWith(
        'test@example.com',
        'hashed_password',
        'John'
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'User created' });
    });

    // Reject registration when email already exists
    test('Register Existing User', async () => {
      req.body = {
        email: 'existing@example.com',
        pass: 'password123',
        name: 'Jane'
      };
      createUser.mockRejectedValue(new Error('UNIQUE constraint failed'));

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Email already in use' });
    });
  });

  describe('Login', () => {
    // Successfully login with valid credentials and set cookie
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
      getAuthCredentials.mockResolvedValue(mockUser);
      bcrypt.compareSync.mockReturnValue(true);

      await login(req, res);

      expect(getAuthCredentials).toHaveBeenCalledWith('test@example.com');
      expect(bcrypt.compareSync).toHaveBeenCalledWith('password123', 'hashed_password');
      expect(jwt.sign).toHaveBeenCalled();
      expect(res.cookie).toHaveBeenCalledWith('token', 'mock_token', {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 1800000
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Login successful' });
    });

    // Reject login when email doesn't exist
    test('Invalid Email', async () => {
      req.body = {
        email: 'nonexistent@example.com',
        pass: 'password123'
      };
      getAuthCredentials.mockResolvedValue(undefined);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid login' });
    });

    // Reject login when password is incorrect
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
      getAuthCredentials.mockResolvedValue(mockUser);
      bcrypt.compareSync.mockReturnValue(false);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid login' });
    });

    // Handle database errors during login
    test('Server Error', async () => {
      req.body = {
        email: 'test@example.com',
        pass: 'password123'
      };
      getAuthCredentials.mockRejectedValue(new Error('DB Error'));

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
  });
});
