# How to Restart the Hotel Check-In Application

## Option 1: Soft Restart (Keep Database)

This keeps your database data but restarts all containers.

```bash
cd "D:\PROJECT X\hotel-checkin-assistant"

# Stop all containers
docker compose down

# Start again
docker compose up --build
```

---

## Option 2: Full Clean Restart (Reset Everything)

This wipes the database and starts completely fresh.

```bash
cd "D:\PROJECT X\hotel-checkin-assistant"

# Stop all containers and remove volumes (database data)
docker compose down -v

# Remove any orphaned containers
docker compose down --remove-orphans

# Optional: Clean up Docker system (removes unused images/containers)
docker system prune -f

# Rebuild and start fresh
docker compose up --build
```

---

## Option 3: Restart Individual Services

### Restart just the backend (API):
```bash
docker compose restart api
```

### Restart just the frontend (Web):
```bash
docker compose restart web
```

### Restart just the database:
```bash
docker compose restart db
```

### Rebuild a specific service:
```bash
# Backend only
docker compose up -d --build api

# Frontend only
docker compose up -d --build web
```

---

## Clear Browser Data

If you want to reset the check-in flow on the frontend:

1. **Open Browser DevTools:** Press `F12`
2. **Go to Application tab** (Chrome/Edge) or **Storage tab** (Firefox)
3. **Clear:**
   - Session Storage → Right-click → Clear
   - Local Storage → Right-click → Clear
4. **Refresh the page:** `Ctrl + F5` (hard refresh)

**Or use Incognito/Private mode** for a clean session each time.

---

## Common Issues

### Port Already in Use

If you get "port already in use" errors:

**Check what's using the ports:**
```bash
# Check port 3000 (frontend)
netstat -ano | findstr :3000

# Check port 8000 (backend)
netstat -ano | findstr :8000

# Check port 5432 (database)
netstat -ano | findstr :5432
```

**Stop the processes or change ports in docker-compose.yml**

### Database Connection Issues

If the API can't connect to the database:

```bash
# Check database logs
docker compose logs db

# Ensure database is healthy
docker compose ps

# Wait for database to be ready (it has a health check)
# The API will wait for the database automatically
```

### Docker Desktop Not Running

Make sure **Docker Desktop is running** before executing any docker commands.

---

## Quick Commands Reference

```bash
# View running containers
docker compose ps

# View logs (all services)
docker compose logs

# View logs for specific service
docker compose logs api
docker compose logs web
docker compose logs db

# Follow logs in real-time
docker compose logs -f api

# Stop containers without removing
docker compose stop

# Start stopped containers
docker compose start

# Remove everything (containers, networks, volumes)
docker compose down -v
```

---

## Access Points After Starting

| Service | URL | Credentials |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | N/A |
| Backend API | http://localhost:8000/docs | N/A |
| pgAdmin | http://localhost:5050 | admin@example.com / admin |
| Database (direct) | localhost:5432 | checkin_admin / dbpass |

---

## Starting Fresh Check-In Flow

To test the check-in flow from the beginning:

1. **Open browser in Incognito/Private mode**
2. **Go to:** http://localhost:3000
3. **Select language** (top-right dropdown)
4. **Click "Start Check-In"**
5. **Follow the steps:**
   - Scan ID
   - Verify face
   - Confirm booking (edit name/dates if needed)
   - Complete

**Test Data:**

Use these names when testing (they're in the database):
- Jane Dull (Passport: X1234567)
- John Smith (Passport: Y9876543)
- CHANG SHUJEN (Passport: A1234567)
- KRUPAL SOLANKI (Passport: A1234568)

---

## Troubleshooting

### Voice Assistant Not Working

The **SimpleVoiceAssistant** (Text-to-Speech) should work automatically. If it doesn't:

1. Check browser console (F12 → Console tab)
2. Ensure browser supports Web Speech API
3. Click the "🔊 Play" button manually
4. Try a different browser (Chrome/Edge work best)

### Language Not Changing

1. Clear browser cache (Ctrl + Shift + Delete)
2. Check browser console for errors
3. Try Incognito mode

### Changes Not Showing

After changing code:

```bash
# Backend changes
docker compose restart api

# Frontend changes
docker compose restart web

# Database schema changes
docker compose down -v
docker compose up --build
```
