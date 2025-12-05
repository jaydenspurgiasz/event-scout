import { jest } from '@jest/globals';

jest.unstable_mockModule('../models/friendModel.js', () => ({
  sendFriendRequest: jest.fn(),
  acceptFriendRequest: jest.fn(),
  rejectFriendRequest: jest.fn(),
  deleteFriend: jest.fn(),
  getFriends: jest.fn(),
  getFriendRequests: jest.fn(),
}));

const {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  deleteFriend,
  getFriends,
  getFriendRequests
} = await import('../models/friendModel.js');

const {
  sendRequest,
  acceptRequest,
  rejectRequest,
  removeFriend,
  getAllFriends,
  getRequests
} = await import('../controllers/friendController.js');

describe('Friend Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { id: 1 },
      body: {},
      params: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('sendRequest', () => {
    // Successfully send friend request
    test('Send friend request successfully', async () => {
      req.body = { friendId: 2 };
      sendFriendRequest.mockResolvedValue();

      await sendRequest(req, res);

      expect(sendFriendRequest).toHaveBeenCalledWith(1, 2);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Friend request sent' });
    });
  });

  describe('acceptRequest', () => {
    // Successfully accept friend request
    test('Accept friend request successfully', async () => {
      req.body = { friendId: 2 };
      acceptFriendRequest.mockResolvedValue();

      await acceptRequest(req, res);

      expect(acceptFriendRequest).toHaveBeenCalledWith(1, 2);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Friend request accepted' });
    });
  });

  describe('rejectRequest', () => {
    // Successfully reject friend request
    test('Reject friend request successfully', async () => {
      req.body = { friendId: 2 };
      rejectFriendRequest.mockResolvedValue();

      await rejectRequest(req, res);

      expect(rejectFriendRequest).toHaveBeenCalledWith(1, 2);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Friend request rejected' });
    });
  });

  describe('removeFriend', () => {
    // Successfully remove friend
    test('Remove friend successfully', async () => {
      req.body = { friendId: 2 };
      deleteFriend.mockResolvedValue();

      await removeFriend(req, res);

      expect(deleteFriend).toHaveBeenCalledWith(1, 2);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Friend removed' });
    });
  });

  describe('getAllFriends', () => {
    // Successfully return list of friends
    test('Get list of friends', async () => {
      const mockFriends = [{ id: 2, name: 'Friend' }];
      getFriends.mockResolvedValue(mockFriends);

      await getAllFriends(req, res);

      expect(getFriends).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockFriends);
    });
  });

  describe('getRequests', () => {
    // Successfully return list of friend requests
    test('Get list of friend requests', async () => {
      const mockRequests = [{ user_id: 2, status: 'pending' }];
      getFriendRequests.mockResolvedValue(mockRequests);

      await getRequests(req, res);

      expect(getFriendRequests).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockRequests);
    });
  });
});
