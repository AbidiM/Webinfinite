const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables from the .env file
dotenv.config();
console.log("process.env.BASE_URL",process.env.BASE_URL);

// Define content for environment.ts
const envConfigFile = `
  export const environment = {
    production: false,
    baseURL: "${process.env.BASE_URL}",
    featureFlag: ${process.env.FEATURE_FLAG === 'true'}
  };
`;

// Write the environment.ts file
fs.writeFileSync('./src/environments/environment.ts', envConfigFile);
fs.writeFileSync('./src/environments/environment.prod.ts', envConfigFile);
console.log('Environment file generated successfully');
// console.log({envConfigFile});

