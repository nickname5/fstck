const UserService = require('../services/UserService');

const getUsers = async (req, res) => {
  try {
    const users = await UserService.getUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const user = await UserService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const resolveUser = async (req, res) => {
  try {
    const googleId = req.params.googleId;

    const user = await UserService.resolveUser(googleId);
    res.status(201).json({ userId: user.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getUsers,
  createUser,
  resolveUser,
};
