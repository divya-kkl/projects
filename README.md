# new
# Login App

Simple login-like app with signup and admin pages using Vercel serverless API routes.  
No database — users are stored in memory (reset on redeploy).

## Pages
- `/signup.html` → Add user (name, email, password)
- `/admin.html` → View all saved users

## API
- `GET /api/users` → Get all users
- `POST /api/users` → Add a new user (expects JSON body)

Example:
```bash
curl -X POST https://login-app.vercel.app/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"1234"}'
# websitetry
