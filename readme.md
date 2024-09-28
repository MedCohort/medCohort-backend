# MEDCOHORT

## Overview
MEDCOHORT is a web application designed to manage clients, writers, admins, and assignments. It utilizes Node.js, Express, and Prisma for the backend, with PostgreSQL as the database. The application includes features for user authentication, assignment management, and email notifications.

## Features
- User registration and authentication
- Admin management
- Writer management
- Assignment creation and management
- Email notifications for welcome and password reset
- JWT-based authentication

## Technologies Used
- **Node.js**: JavaScript runtime for building the server-side application.
- **Express**: Web framework for Node.js to handle routing and middleware.
- **Prisma**: ORM for database interactions.
- **PostgreSQL**: Relational database for storing application data.
- **Nodemailer**: For sending emails.
- **Faker.js**: For generating fake data for testing purposes.
- **Express Validator**: For validating user input.

## Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:Binamin-hussein100/medCohort-backend.git
   cd medcohort
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```
   DATABASE_URL=your_database_url
   SMTP_USER=your_email@example.com
   SMTP_PASSWORD=your_email_password
   JWT_SECRET=your_jwt_secret
   ```

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Start the application:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- **POST** `/auth/registerClient`: Register a new client.
- **POST** `/auth/loginClient`: Log in a client.
- **POST** `/auth/request-password-reset`: Request a password reset link.
- **POST** `/auth/reset-password/:token`: Reset the password using the token.

### Admin Routes
- **GET** `/api/admin/allAdmins`: Retrieve all admins.
- **POST** `/api/admin/addAdmin`: Add a new admin.

### Writer Routes
- **GET** `/api/writer/allWriters`: Retrieve all writers.
- **POST** `/api/writer/newWriter`: Create a new writer.
- **PUT** `/api/writer/updateWriter/:id`: Update a writer's information.
- **DELETE** `/api/writer/deleteWriter/:id`: Delete a writer.

### Client Routes
- **GET** `/api/client/allClient`: Retrieve all clients.
- **GET** `/api/client/getClient`: Retrieve a specific client by ID.
- **PUT** `/api/client/updateClient/:id`: Update a client's information.
- **DELETE** `/api/client/deleteClient/:id`: Delete a client.

### Assignment Routes
- **GET** `/api/assignments/allAssignments`: Retrieve all assignments.
- **POST** `/api/assignments/newAssignment`: Create a new assignment.
- **PUT** `/api/assignments/updateAssignment/:id`: Update an assignment.
- **DELETE** `/api/assignments/deleteAssignment/:id`: Delete an assignment.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

