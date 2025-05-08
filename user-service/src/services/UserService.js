const { user } = require('../../prisma');

const getUsers = async () => {
  try {
    return await user.findMany();
  } catch (error) {
    throw new Error(`Error fetching users: ${error.message}`);
  }
};

const createUser = async (data) => {
  try {
    return await user.create({ data });
  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }
};

module.exports = { getUsers, createUser };
