const config = {
  default: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    dialect: 'postgres',
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
  },
  development: {
    extend: 'default',
  },
  test: {
    host: process.env.TEST_DATABASE_HOST,
    extend: 'default',
    dialect: 'postgres',
    database: 'foku_test',
  },
  production: {
    extend: 'default',
    dialect: 'postgres',
  },
};

Object.keys(config).forEach((configKey) => {
  const configValue = config[configKey];
  if (configValue.extend) {
    config[configKey] = { ...config[configValue.extend], ...configValue };
  }
});

module.exports = config;
