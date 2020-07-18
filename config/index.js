// import dotenv from 'dotenv';
const dotenv = require('dotenv');

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
// if (envFound.error) {
//   // This error should crash whole process
//   throw new Error("⚠️  Couldn't find .env file  ⚠️");
// }

exports.port = process.env.PORT;
exports.api= {
    prefix: '/api',
  };

exports.mongodb = {
    dbUser: process.env.DBUSER,
    dbPass: process.env.DBPASS,
    dbName: process.env.DBNAME,
    dbUrl: process.env.DBURL,
}

exports.email = {
  EmUser: process.env.EMUSER,
  EmPass: process.env.EMPASS,
  EmService: process.env.EMSERVICE
};

exports.api= {
  prefix: '/api',
};

exports.loginCred = {
  username: process.env.ADMINUSERNAME,
  password: process.env.ADMINPASSWORD,
  loggedIn: process.env.ADMINLOGGEDIN,
}

exports.accessToken = process.env.ACCESSTOKEN




