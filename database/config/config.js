require('dotenv/config');

const { DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD } = process.env;

// For the sake of this project, we'll use a shared database settings object.
// In a real world situation, this wouldn't be the case.
const sharedDbSettings = {
  host: 'localhost',
  database: DATABASE_NAME,
  username: DATABASE_USERNAME,
  password: DATABASE_PASSWORD,
  dialect: 'postgres',
  define: {
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
};

module.exports = {
  development: sharedDbSettings,
  test: sharedDbSettings,
  production: sharedDbSettings,
};
