# 📡 Expo Backend API

This is the backend API powering the Expo-based mobile app. It handles routes for sermons, events, communities, user authentication, and real-time features like chat via Socket.IO.

---

## 🔧 Tech Stack

- **Node.js** / **Express**
- **PostgreSQL** (hosted via Railway)
- **Socket.IO** (for real-time features)
- **JWT** (authentication)
- **Cloudinary** (media hosting)
- **Expo Router** (on frontend)
- **Hosted on**: Railway

---

## 📁 Project Structure

```bash
backend/
├── server/
│   ├── api/              # Route handlers
│   ├── db/               # Database queries
│   ├── socket/           # Socket.IO handlers
├── .env                  # Environment variables
├── app.js                # Entry point

## API Endpoints
| Method | Route             | Description       |
| ------ | ----------------- | ----------------- |
| GET    | `/api/events`     | Fetch all events  |
| POST   | `/api/users`      | Create user       |
| POST   | `/api/auth/login` | Log in            |
| GET    | `/api/sermons`    | Fetch sermons     |
| POST   | `/api/messages`   | Send chat message |

Built by Nathanael S with <3 for church community apps.
