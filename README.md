# Mentory

Mentory is a project where users can create an account, set up a profile as a mentor or mentee, specify their skills or areas of interest, and find matches with others for mentorship opportunities. This repository contains the source code and necessary configurations to set up and run the application.

## Deployed URL

The application is deployed and accessible at: [mentory.works](https://mentory.works)

## Technologies Used

Mentory uses the following technologies:

- **Handlebars** (61.5%): For templating and building dynamic HTML content.
- **TypeScript** (35.6%): For strong typing and modern JavaScript development.
- **CSS** (2.3%): For styling the application.
- **JavaScript** (0.6%): For additional scripting needs.

## Setup Instructions

Follow these steps to set up the project locally:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/PhKhang/Mentory.git
   cd Mentory
   ```
2. **Install dependencies**: Ensure you have Node.js installed. Then run:
   ```bash
   npm install
   ```
    
3. **Compile TypeScript**: This project uses TypeScript. Compile the TypeScript files using:
```bash
npm run build
```

4. **Run the application**: Start the application locally:
```bash
npm start
```

The application should now be running on http://localhost:4000 (or the port specified in your configuration).

## Necessary Configurations
1. **TypeScript Configuration**: The project uses a tsconfig.json file for TypeScript compiler options. The key configurations are:

Target: ES6
Module: CommonJS
Output Directory: ./dist
Include: src/**/*.ts
Exclude: node_modules
You can view the full tsconfig.json here.

2. **Environment Variables**: Check if the application requires any .env file for storing sensitive data like API keys or database credentials. Create a .env file in the root directory if necessary with the required variables

## Features
