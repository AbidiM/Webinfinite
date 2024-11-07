const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  plugins: [
    new Dotenv({
      path: path.resolve(__dirname, '.env'), // Path to your .env file
      safe: true,     // Load '.env.example' to verify the .env file
      systemvars: true, // Load system environment variables
    })
  ]
};
