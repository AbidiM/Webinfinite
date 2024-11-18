const fs = require('fs');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from the .env file
dotenv.config();

// Define content for environment.ts
const envConfigFile = `
  export const environment = {
    production: false,
    baseURL: "${process.env.BASE_URL}",
    featureFlag: ${process.env.FEATURE_FLAG === 'true'}
  };
`;

const envFilePath = './src/environments/environment.ts';
const prodEnvFilePath = './src/environments/environment.prod.ts';

// Function to ensure the directory exists before writing the file
function ensureDirAndWriteFile(filePath, content) {
  const dirPath = path.dirname(filePath);

  // Check if the directory exists, and if not, create it
  if (!fs.existsSync(dirPath)) {
    console.log(`Directory doesn't exist. Creating: ${dirPath}`);
    fs.mkdirSync(dirPath, { recursive: true });
  }

  // Write the content to the file
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`File written to: ${filePath}`);
}

// Write the environment files
ensureDirAndWriteFile(envFilePath, envConfigFile);
ensureDirAndWriteFile(prodEnvFilePath, envConfigFile);

