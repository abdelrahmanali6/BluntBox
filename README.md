# BluntBox

BluntBox is a modern, secure, and AI-powered anonymous messaging platform inspired by Sarhne, designed for both web and mobile use. It allows users to register, log in, and receive anonymous messages, with robust moderation powered by **Llama 3 (via Groq API)** to ensure all content is safe and appropriate. The platform features real-time notifications using **SignalR**, a responsive inbox and public wall, support for English and Arabic (including RTL and font handling), and a user-friendly interface for sending, receiving, and replying to messages. The frontend is built using **Angular** for a seamless user experience. The backend uses **ASP.NET Core**, **EF Core**, and **SQL Server** for a scalable and secure architecture.

---

## Features

* Anonymous messaging with robust AI moderation
* Real-time notifications via SignalR
* Public wall & private inbox
* Multilingual support (English & Arabic, including RTL)
* JWT-based authentication and secure login
* Message attachments support
* Sentiment analysis using AI
* Responsive UI with Angular frontend
* Scalable backend architecture with ASP.NET Core and SQL Server

---

## Tech Stack

**Frontend:** Angular, HTML, CSS, Bootstrap
**Backend:** ASP.NET Core, EF Core
**Database:** SQL Server
**AI/ML:** Llama 3 via Groq API
**Real-time Communication:** SignalR
**Authentication:** JWT

---

## Project Structure

```
BluntBox/
├─ Frontend/        # Angular frontend project
└─ Backend/         # ASP.NET Core backend project
```

---

## Installation

### Prerequisites

* .NET 9.0 SDK or above
* Node.js & Angular CLI
* SQL Server
* Groq API Key for Llama 3 (a **test key** is included for development, but it's recommended to generate your own API Key for production)

### Steps

1. **Clone the repository**

```bash
git clone https://github.com/your-username/bluntbox.git
cd bluntbox
```

2. **Set up the backend**

```bash
cd Backend
dotnet restore
dotnet build
```

3. **Set up the frontend**

```bash
cd Frontend
npm install
ng serve --open
```

4. **Configure AI (Groq API Key)**

* In `Backend/appsettings.json`:

```json
"Ai": {
  "ApiKey": "YOUR_API_KEY_HERE"
}
```

> Note: A test API key is included for development purposes, but replace it with your own Groq API key for production.

5. **Run the application**

* Backend: `dotnet run`
* Frontend: `ng serve --open`

---

## API Endpoints

* `POST /register` – Register a new user
* `POST /login` – Login and receive JWT
* `POST /message` – Send a message
* `POST /message/reply/{messageId}` – Reply to a message
* `GET /publicmessage/{recipientUserId}` – Get public messages for a user
* Additional endpoints are available for managing users, messages, attachments, and AI-based moderation and more.

---

## Usage

1. Register or log in to your account
2. Send anonymous messages to other users
3. Reply to messages or view public messages on the wall
4. Receive real-time notifications
5. Optionally, configure your own Groq API Key for AI moderation

---

## License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

---

## Notes

* Supports both English and Arabic (with proper RTL rendering and font support)
* AI-powered features (moderation and sentiment analysis) use **Llama 3 via Groq API**
* Frontend and backend are separate, making deployment or scaling independent
* JWT authentication ensures secure communication between frontend and backend
