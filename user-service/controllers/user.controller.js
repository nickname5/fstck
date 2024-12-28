const getUsers = async (req, res) => {
  try {
    res.status(200).json([
      {
        id: 1,
        name: 'John Doe',
        email: 'johndoe@gmail.com',
      },
      {
        id: 2,
        name: 'Jane Doe',
        email: 'jane@gmail.com',
      },
    ]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getUsers,
};
