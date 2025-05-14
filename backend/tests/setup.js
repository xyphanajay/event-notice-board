// Test setup file
const { sequelize } = require('../src/models');

beforeAll(async () => {
  // Sync all models to the test database
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  // Close database connection
  await sequelize.close();
});