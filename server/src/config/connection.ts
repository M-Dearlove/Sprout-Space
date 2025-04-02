import dotenv from 'dotenv';
dotenv.config();

import { Sequelize } from 'sequelize';

const sequelize = process.env.DB_URL
  ? new Sequelize(process.env.DB_URL, {
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false, // Set to `true` if using a trusted CA certificate
        },
      },
    })
  : new Sequelize(
      process.env.DB_NAME || '',
      process.env.DB_USER || '',
      process.env.DB_PASSWORD || '',
      {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        dialectOptions: {
          ssl: process.env.DB_SSL === 'true' ? { require: true, rejectUnauthorized: false } : false, // Allows toggling SSL
          decimalNumbers: true,
        },
      }
    );


export default sequelize;