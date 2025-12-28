# BluntBox

BluntBox is a modern, secure, and AI-powered anonymous messaging platform inspired by Sarhne. It allows users to register, log in, and receive anonymous messages, with robust moderation powered by LLaMa 3 via Groq API. The platform features real-time notifications using SignalR, a responsive inbox and public wall, support for both English and Arabic languages (including RTL and font handling), and a user-friendly interface for sending, receiving, and replying to messages. Additional features include JWT-based authentication, password management, message attachments, sentiment analysis, and a scalable architecture built with ASP.NET Core, EF Core, and SQL Server, making BluntBox ideal for personal, educational, or organizational feedback and communication scenarios.

## Project Structure

```
BluntBox/
├─ Backend/      # .NET 9+ ASP.NET Core Web API project
├─ Frontend/     # Angular project
```

## Live Deployment

Frontend (Angular – Netlify):  
https://vermillion-queijadas-6eec4d.netlify.app/

## Installation

### Backend

1. Navigate to the Backend folder:

   ```bash
   cd Backend
   ```
2. Restore NuGet packages:

   ```bash
   dotnet restore
   ```
3. Update your `appsettings.json` with your Groq API key and other configurations.
4. Run the backend:

   ```bash
   dotnet run
   ```

### Frontend

1. Navigate to the Frontend folder:

   ```bash
   cd Frontend
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Run the Angular frontend:

   ```bash
   ng serve
   ```

## Test Groq API Key

The project includes a test Groq API key for LLaMa 3, but it is highly recommended to replace it with your own API key from Groq for production use.

## Features

* Register & Login
* Send and receive anonymous messages
* Reply to messages
* Public wall to see public messages
* Real-time notifications using SignalR
* AI moderation powered by LLaMa 3 (Groq API)
* Sentiment analysis
* Message attachments
* Multi-language support (English & Arabic, RTL ready)
* JWT-based authentication

## API Endpoints

* `POST /api/auth/register` - Register a new user
* `POST /api/auth/login` - Login user
* `POST /api/message` - Send a message
* `POST /api/message/reply/{messageId}` - Reply to a message
* `GET /api/publicmessage/{recipientUserId}` - Get public messages for a user
* Additional endpoints for retrieving recipientUserId and other necessary data for frontend

## Tech Stack

**Frontend:**
Angular, TypeScript, HTML, CSS, Bootstrap

**Backend:**
ASP.NET Core 9+, C#, Entity Framework Core

**Database:**
SQL Server

**AI / ML:**
LLaMa 3 via Groq API

**Real-time:**
SignalR

**Authentication:**
JWT

## Usage

1. Make sure backend is running on `http://localhost:5000` (default) or your configured URL.
2. Run the Angular frontend.
3. Use the application to register, login, send anonymous messages, and interact with the public wall.

## Notes

* Replace the test Groq API key in `appsettings.json` with your own for production.
* Ensure SQL Server is running and connection strings are properly configured.
* Supports English and Arabic (RTL).
* Real-time updates via SignalR require backend to be running.

## License

This project is licensed under the MIT License.
