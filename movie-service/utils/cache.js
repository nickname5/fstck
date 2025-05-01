const logger = require('../config/logger');
const { getClient } = require('../config/redis');

const Cache = {
  get: async (key) => {
    try {
      const data = await getClient().get(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      logger.warn(`Error getting key ${key}, ${e}`);
      return null;
    }
  },
  set: async (key, value) => {
    try {
      await getClient().set(key, JSON.stringify(value));
    } catch (e) {
      logger.warn(`Error setting key ${key}, ${e}`);
      return null;
    }
  },
};

module.exports = Cache;
