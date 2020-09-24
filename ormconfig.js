// require('dotenv').config();
// module.exports = {
//   type: process.env.type,
//   host: process.env.host,
//   port: parseInt(process.env.port),
//   database: process.env.database,
//   username: process.env.username,
//   password: process.env.password,
//   synchronize: false,
//   logging: true,
//   extra: {
//     driver: 'msnodesqlv8',
//     options: {
//       trustedConnection: true,
//     },
//   },
//   entities: ['dist/**/*.entity.js'],
//   migrations: ['dist/database/migrations/*.js'],
//   subscribers: ['dist/database/subscriber/*.js'],
//   cli: { migrationsDir: 'src/database/migrations' },
// };

module.exports = {
  type: process.env.type,
  host: "ADMIN\\SQLEXPRESS",
  port: parseInt(process.env.port),
  database: process.env.database,
  username: process.env.usernamedb,
  password: process.env.password,
  synchronize: false,
  logging: true,
  extra: {
    driver: 'msnodesqlv8',
    options: {
      trustedConnection: true,
    },
  },
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/database/migrations/*.js'],
  subscribers: ['dist/database/subscriber/*.js'],
  cli: { migrationsDir: 'src/database/migrations' },
};
