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

Tech stack:

- **Express.js + Handlebars**: Backend and templating
- **jsonwebtoken + Bcrypt**: Authentication
- **Prisma**: ORM
- **Supabase**: PostgreSQL
- **Azure Virtual Machines**: Hosting

## Setup Instructions

Follow these steps to set up the project locally:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/PhKhang/Mentory.git
   cd Mentory
   ```

1. **Configure `.env` file**:

   Copy the `.env.example` file to `.env` and fill in the necessary environment variables. This includes your database connection string, JWT secret, and any other required configurations.

   ```bash
   cp .env.example .env
   ```

   Then, open the `.env` file and fill in the required values.

1. **Install dependencies**:

   Ensure you have Node.js installed. Then run:

   ```bash
   npm i
   ```

1. **Compile TypeScript**:

   This project uses TypeScript. Compile the TypeScript files using:

   ```bash
   npm run build
   ```

1. **Run the application**:

   Start the application locally:

   ```bash
   npm start
   ```

The application should now be running on http://localhost:4000 (or the port specified in your configuration).

## Necessary Configurations

1. **TypeScript Configuration**: The project uses a `tsconfig.json` file for TypeScript compiler options. The key configurations are:

   Target: `ES6`\
   Module: `CommonJS`\
   Output Directory: `./dist`\
   Include: `src/**/*.ts`\
   Exclude: `node_modules`\
   You can view the full `tsconfig.json` in the source code.

2. **Environment Variables**: The project needs at least the following keys:

- `JWT_SECRET`: for signing jwt
- `DATABASE_URL`: for communication with a PostgreSQL database, Supabase can be used to create one

## Features
