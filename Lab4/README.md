# Lab 4: Dockerizing a TypeScript REST API

## Overview

In this lab, you will learn how to containerize a TypeScript REST API using Docker. The application is already built and ready to use - your focus will be on creating a Dockerfile from scratch, building a Docker image, and running the application in a container.

## Prerequisites

- Docker installed on your system
- Basic understanding of Docker concepts
- Node.js installed (for local testing, optional)

## Application Overview

The provided REST API is a simple user management service built with:
- **TypeScript** - Type-safe JavaScript
- **Express.js** - Web framework
- **In-memory storage** - No database required

### Project Structure

```
lab-docker-typescript-api/
├── src/
│   ├── index.ts              # Main application entry point
│   ├── routes/
│   │   └── userRoutes.ts     # Route definitions
│   ├── controllers/
│   │   └── userController.ts # Business logic
│   └── models/
│       └── user.ts           # Data models and store
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
└── .dockerignore             # Files to exclude from Docker build
```

### Available Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Part 1: Understanding the Application

### Step 1: Review the Application Code

Take a moment to browse through the source files to understand the structure:

1. **src/index.ts** - Sets up the Express server, middleware, and routes
2. **src/routes/userRoutes.ts** - Defines the API endpoints
3. **src/controllers/userController.ts** - Contains the business logic
4. **src/models/user.ts** - Defines the User model and in-memory store

### Step 2: Review package.json

Open [package.json](package.json) and notice the important scripts:

```json
"scripts": {
  "build": "tsc",           // Compiles TypeScript to JavaScript
  "start": "node dist/index.js",  // Runs the compiled application
  "dev": "ts-node src/index.ts",  // Development mode
  "clean": "rm -rf dist"    // Cleans build artifacts
}
```

**Key Dependencies:**
- `express` - Web framework
- `typescript` - TypeScript compiler
- `@types/express`, `@types/node` - Type definitions

### Step 3: Understanding the Build Process

The application follows this build process:
1. TypeScript files in `src/` are compiled using `npm run build`
2. JavaScript output goes to `dist/` directory
3. The application runs from `dist/index.js`

---

## Part 2: Creating the Dockerfile

Now you'll create a Dockerfile from scratch to containerize this application.

### Step 1: Create the Dockerfile

Create a new file named `Dockerfile` (no extension) in the project root:

```bash
touch Dockerfile
```

### Step 2: Choose a Base Image

Every Dockerfile starts with a `FROM` instruction that specifies the base image. For a Node.js application, we'll use the official Node.js image.

Add this to your Dockerfile:

```dockerfile
FROM node:20-alpine
```

**Explanation:**
- `node:20-alpine` - Official Node.js 20 image based on Alpine Linux
- Alpine is a minimal Linux distribution (~5MB), making images smaller
- Alternative: `node:20` (Debian-based, larger but more compatible)

### Step 3: Set the Working Directory

Set a working directory inside the container where your application will live:

```dockerfile
WORKDIR /app
```

**Explanation:**
- All subsequent commands will run in `/app`
- Creates the directory if it doesn't exist
- Best practice: Use `/app` or `/usr/src/app`

### Step 4: Copy Package Files

Copy `package.json` and `package-lock.json` (if exists) first:

```dockerfile
COPY package*.json ./
```

**Explanation:**
- `package*.json` - Matches both `package.json` and `package-lock.json`
- `./` - Copies to the current WORKDIR (`/app`)
- **Why separate?** Docker caches layers. If dependencies don't change, this layer is reused, speeding up builds

### Step 5: Install Dependencies

Install the Node.js dependencies:

```dockerfile
RUN npm install
```

**Explanation:**
- `RUN` - Executes a command during the build process
- `npm install` - Installs dependencies from `package.json`
- This creates a new layer with `node_modules/`

**For production**, you might use:
```dockerfile
RUN npm ci --only=production
```
- `npm ci` - Cleaner install (faster, more reliable)
- `--only=production` - Skips devDependencies

### Step 6: Copy Application Source Code

Copy the rest of the application files:

```dockerfile
COPY . .
```

**Explanation:**
- First `.` - Source (current directory on host)
- Second `.` - Destination (WORKDIR in container)
- `.dockerignore` file excludes unnecessary files

### Step 7: Build the TypeScript Application

Compile TypeScript to JavaScript:

```dockerfile
RUN npm run build
```

**Explanation:**
- Runs the `build` script from `package.json`
- Executes `tsc` to compile TypeScript
- Outputs JavaScript files to `dist/` directory

### Step 8: Expose the Port

Document which port the application listens on:

```dockerfile
EXPOSE 3000
```

**Explanation:**
- Documents that the app listens on port 3000
- **Does not** actually publish the port
- Informational for developers and tools

### Step 9: Define the Startup Command

Specify the command to run when the container starts:

```dockerfile
CMD ["npm", "start"]
```

**Explanation:**
- `CMD` - Default command to execute
- JSON array format (exec form) - Recommended
- Runs `npm start` which executes `node dist/index.js`

**Alternative formats:**
```dockerfile
CMD ["node", "dist/index.js"]  # Direct execution (preferred for production)
```

### Complete Dockerfile

Your complete `Dockerfile` should look like this:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

---

## Part 3: Building the Docker Image

### Step 1: Build the Image

Run the following command in the project directory:

```bash
docker build -t typescript-api:1.0 .
```

**Explanation:**
- `docker build` - Build an image from a Dockerfile
- `-t typescript-api:1.0` - Tag the image with name:version
- `.` - Build context (current directory)

**What happens during the build:**
1. Docker reads the Dockerfile
2. Executes each instruction in order
3. Each instruction creates a new layer
4. Layers are cached for faster rebuilds

### Step 2: Verify the Image

List Docker images to confirm it was created:

```bash
docker images
```

You should see your image:
```
REPOSITORY       TAG     IMAGE ID       CREATED         SIZE
typescript-api   1.0     abc123def456   5 seconds ago   ~200MB
```

### Step 3: Inspect the Image

Get detailed information about the image:

```bash
docker inspect typescript-api:1.0
```

---

## Part 4: Running the Container

### Step 1: Run the Container

Start a container from your image:

```bash
docker run -d -p 3000:3000 --name my-api typescript-api:1.0
```

**Explanation:**
- `docker run` - Create and start a container
- `-d` - Detached mode (runs in background)
- `-p 3000:3000` - Port mapping (host:container)
- `--name my-api` - Give the container a friendly name
- `typescript-api:1.0` - Image to use

### Step 2: Check Container Status

Verify the container is running:

```bash
docker ps
```

Expected output:
```
CONTAINER ID   IMAGE               COMMAND       STATUS         PORTS
abc123         typescript-api:1.0  "npm start"   Up 10 seconds  0.0.0.0:3000->3000/tcp
```

### Step 3: View Container Logs

Check the application logs:

```bash
docker logs my-api
```

You should see:
```
Server is running on port 3000
Health check: http://localhost:3000/health
API endpoint: http://localhost:3000/api/users
```

### Step 4: Follow Logs in Real-Time

To watch logs as they happen:

```bash
docker logs -f my-api
```

Press `Ctrl+C` to stop following.

---

## Part 5: Testing the API

### Step 1: Test the Health Endpoint

Using curl:
```bash
curl http://localhost:3000/health
```

Using a browser:
```
http://localhost:3000/health
```

Expected response:
```json
{
  "status": "UP",
  "timestamp": "2026-02-16T10:30:00.000Z"
}
```

### Step 2: Get All Users

```bash
curl http://localhost:3000/api/users
```

Expected response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2024-01-15T00:00:00.000Z"
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane@example.com",
      "createdAt": "2024-02-20T00:00:00.000Z"
    }
  ],
  "count": 2
}
```

### Step 3: Create a New User

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice Johnson", "email": "alice@example.com"}'
```

### Step 4: Get a Specific User

```bash
curl http://localhost:3000/api/users/1
```

### Step 5: Update a User

```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "John Updated", "email": "john.new@example.com"}'
```

### Step 6: Delete a User

```bash
curl -X DELETE http://localhost:3000/api/users/1
```

---

## Part 6: Container Management

### Stopping the Container

```bash
docker stop my-api
```

### Starting a Stopped Container

```bash
docker start my-api
```

### Restarting the Container

```bash
docker restart my-api
```

### Removing the Container

First stop it, then remove:
```bash
docker stop my-api
docker rm my-api
```

Or force remove (stop and remove):
```bash
docker rm -f my-api
```

### Executing Commands Inside the Container

Get a shell inside the running container:
```bash
docker exec -it my-api sh
```

Run a single command:
```bash
docker exec my-api ls -la /app
```

---

## Part 7: Advanced Dockerfile Concepts

### Multi-Stage Builds

For production, use multi-stage builds to create smaller images:

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/index.js"]
```

**Benefits:**
- Smaller final image (no dev dependencies)
- Only compiled code and runtime dependencies
- More secure (fewer packages)

### Environment Variables

Modify the Dockerfile to use environment variables:

```dockerfile
ENV PORT=3000
ENV NODE_ENV=production

EXPOSE $PORT

CMD ["npm", "start"]
```

Pass environment variables when running:
```bash
docker run -d -p 8080:8080 -e PORT=8080 --name my-api typescript-api:1.0
```

### Using .dockerignore

The `.dockerignore` file prevents unnecessary files from being copied:

```
node_modules
npm-debug.log
dist
.git
.env
*.md
```

**Benefits:**
- Faster builds
- Smaller build context
- Better security (excludes sensitive files)

---

## Part 8: Troubleshooting

### Build Fails

**Problem:** `npm install` fails
```
Solution: Check your internet connection or use npm cache
```

**Problem:** TypeScript compilation errors
```
Solution: Check tsconfig.json and ensure all types are installed
```

### Container Doesn't Start

Check logs for errors:
```bash
docker logs my-api
```

Inspect the container:
```bash
docker inspect my-api
```

### Port Already in Use

**Problem:** Port 3000 is already in use
```bash
Solution: Use a different host port
docker run -d -p 8080:3000 --name my-api typescript-api:1.0
```

### Cannot Access the API

1. Check if container is running: `docker ps`
2. Check logs: `docker logs my-api`
3. Verify port mapping: `docker port my-api`
4. Test from inside container:
   ```bash
   docker exec my-api wget -O- http://localhost:3000/health
   ```

---

## Part 9: Best Practices

### 1. Use Specific Image Tags

❌ Bad:
```dockerfile
FROM node:latest
```

✅ Good:
```dockerfile
FROM node:20-alpine
```

### 2. Minimize Layers

❌ Bad:
```dockerfile
RUN npm install
RUN npm run build
RUN npm prune --production
```

✅ Good:
```dockerfile
RUN npm install && \
    npm run build && \
    npm prune --production
```

### 3. Order Matters (Layer Caching)

❌ Bad (source changes invalidate npm install):
```dockerfile
COPY . .
RUN npm install
```

✅ Good (package.json changes less frequently):
```dockerfile
COPY package*.json ./
RUN npm install
COPY . .
```

### 4. Use .dockerignore

Always exclude:
- `node_modules`
- `.git`
- Build artifacts
- Logs
- Documentation

### 5. Don't Run as Root

For production, create a non-root user:

```dockerfile
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs
```

### 6. Use Multi-Stage Builds

Separate build and runtime stages for smaller, more secure images.

### 7. Health Checks

Add a health check to your Dockerfile:

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"
```

---

## Summary

In this lab, you learned:

1. ✅ Understanding a TypeScript REST API structure
2. ✅ Creating a Dockerfile from scratch
3. ✅ Understanding each Dockerfile instruction
4. ✅ Building Docker images
5. ✅ Running containers with port mapping
6. ✅ Testing containerized applications
7. ✅ Managing containers (start, stop, logs)
8. ✅ Advanced concepts (multi-stage builds, environment variables)
9. ✅ Troubleshooting common issues
10. ✅ Docker best practices

---

## Next Steps

- Try creating a multi-stage Dockerfile
- Add a `.env` file and pass environment variables
- Create a `docker-compose.yml` for easier management
- Add a database service (PostgreSQL, MongoDB)
- Implement Docker volumes for persistent data
- Push your image to Docker Hub or a private registry

---

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [geeksforgeeks Docker Tutorial](https://www.geeksforgeeks.org/devops/introduction-to-docker/)
- [Node.js Docker Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Express.js Documentation](https://expressjs.com/)
