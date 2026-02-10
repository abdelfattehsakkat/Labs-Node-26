# Lab 3: REST API with Express & TypeScript

## Overview
This lab guides you through building a type-safe REST API using Express.js and TypeScript. You'll apply async patterns from Lab 1 and TypeScript skills from Lab 2 to create a real-world API with proper routing, middleware, error handling, and data persistence.

**What you'll build:** A Task Management REST API with full CRUD operations, validation, and error handling.

---

## Setup

### 1. Create Project Structure
```bash
mkdir lab3-express-api
cd lab3-express-api
npm init -y
```

### 2. Install Dependencies
```bash
# Core dependencies
npm install express

# TypeScript dependencies
npm install --save-dev typescript @types/node @types/express ts-node-dev

# Optional: For auto-restart during development
npm install --save-dev nodemon
```

### 3. Initialize TypeScript
```bash
npx tsc --init
```

### 4. Configure tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 5. Add Scripts to package.json
```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

### 6. Create Project Structure
```bash
mkdir -p src/{routes,middleware,models,controllers}
```

---

## Exercise 1: Basic Express Server with TypeScript

### Objective
Set up a minimal Express server with TypeScript and understand typed request/response objects.

**What you'll do:**
- ✓ Create a basic Express server
- ✓ Add type annotations to Express objects
- ✓ Create your first route
- ✓ Test the server

### Task
Create `src/server.ts` with a basic Express server.

### Starter Code

```typescript
import express from 'express';

// TODO: Add type annotation for the Express application
const app = express();

// TODO: Define the port with proper type
const PORT = 3000;

// TODO: Add middleware to parse JSON bodies
// Hint: express.json()

// TODO: Create a GET route at '/' that returns a welcome message
// Route should return: { message: "Welcome to Task API", version: "1.0.0" }

// TODO: Create a health check route at '/health'
// Return: { status: "ok", timestamp: new Date() }

// TODO: Start the server and log the URL
app.listen(PORT, () => {
  // Log message here
});
```

### Hints
- Express app type: `express.Application`
- Use `app.use()` for middleware
- Route handler signature: `(req: Request, res: Response) => void`
- Send JSON with: `res.json(data)`

### Test Your Server
```bash
npm run dev
# In another terminal or browser:
curl http://localhost:3000
curl http://localhost:3000/health
```

### Questions to Consider
1. What does `express.json()` middleware do?
2. How does TypeScript help catch errors in route handlers?
3. What's the difference between `res.json()` and `res.send()`?

---

## Exercise 2: Creating Type-Safe Models & Routes

### Objective
Define data models with TypeScript interfaces and create CRUD routes for a Task resource.

**What you'll do:**
- ✓ Create a Task interface with proper types
- ✓ Set up in-memory data storage
- ✓ Implement GET all tasks
- ✓ Implement GET task by ID
- ✓ Type request parameters and response data

### Task Part A: Define the Task Model

Create `src/models/task.model.ts`:

```typescript
// TODO: Create an enum for TaskStatus
// Values: PENDING, IN_PROGRESS, COMPLETED

// TODO: Create a Priority type (string literal union)
// Values: "low" | "medium" | "high"

// TODO: Create a Task interface
export interface Task {
  // TODO: Add properties:
  // - id: string
  // - title: string
  // - description: string
  // - status: TaskStatus
  // - priority: Priority
  // - createdAt: Date
  // - updatedAt: Date
}

// TODO: Create a type for creating a task (without id, createdAt, updatedAt)
// Hint: Use Omit<Task, 'id' | 'createdAt' | 'updatedAt'>

// TODO: Create a type for updating a task (all fields optional except id)
// Hint: Use Partial
```

### Task Part B: Create GET Routes

Create `src/routes/task.routes.ts`:

```typescript
import express, { Request, Response } from 'express';
import { Task } from '../models/task.model';

const router = express.Router();

// In-memory storage (we'll improve this later)
let tasks: Task[] = [
  {
    id: '1',
    title: 'Learn TypeScript',
    description: 'Complete Lab 2 exercises',
    status: 'COMPLETED', // TODO: Use enum value
    priority: 'high',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// TODO: GET /tasks - Get all tasks
router.get('/', (req: Request, res: Response) => {
  // TODO: Return all tasks with 200 status
});

// TODO: GET /tasks/:id - Get task by ID
router.get('/:id', (req: Request, res: Response) => {
  // TODO: Get id from request parameters (req.params.id)
  // TODO: Find task by id
  // TODO: If found, return task with 200 status
  // TODO: If not found, return 404 with error message
});

export default router;
```

### Task Part C: Register Routes in Server

Update `src/server.ts`:

```typescript
import express from 'express';
import taskRoutes from './routes/task.routes';

const app = express();
const PORT = 3000;

app.use(express.json());

// TODO: Register task routes at /api/tasks
// Hint: app.use('/api/tasks', taskRoutes)

// Root route
app.get('/', (req, res) => {
  res.json({ message: "Welcome to Task API", version: "1.0.0" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

### Test Your Routes
```bash
# Get all tasks
curl http://localhost:3000/api/tasks

# Get task by ID
curl http://localhost:3000/api/tasks/1

# Try non-existent ID
curl http://localhost:3000/api/tasks/999
```

### Hints
- Type route parameters: `Request<{ id: string }>`
- Type response body: Use generic `Response<Task[]>` or `Response<Task>`
- Array methods: `.find()`, `.filter()`
- HTTP status codes: `res.status(404).json(...)`

### Questions to Consider
1. Why use TypeScript interfaces for data models?
2. How does typing `req.params` help prevent bugs?
3. What HTTP status code should you use for "not found"?

---

## Exercise 3: POST & PUT Routes with Validation

### Objective
Implement routes to create and update tasks with proper request body typing and validation.

**What you'll do:**
- ✓ Create POST route to add new tasks
- ✓ Create PUT route to update tasks
- ✓ Type request bodies
- ✓ Validate incoming data
- ✓ Generate unique IDs

### Task Part A: Install UUID for ID Generation

```bash
npm install uuid
npm install --save-dev @types/uuid
```

### Task Part B: Implement POST Route

Update `src/routes/task.routes.ts`:

```typescript
import { v4 as uuidv4 } from 'uuid';
import { Task, CreateTaskDto } from '../models/task.model';

// TODO: POST /tasks - Create a new task
router.post('/', (req: Request, res: Response) => {
  // TODO: Type the request body as CreateTaskDto
  // Hint: Request<{}, {}, CreateTaskDto>
  
  const { title, description, status, priority } = req.body;
  
  // TODO: Validate required fields
  // If title is missing, return 400 with error message
  
  // TODO: Create new task object
  const newTask: Task = {
    id: uuidv4(),
    title,
    description: description || '',
    status: status || 'PENDING', // Default status
    priority: priority || 'medium', // Default priority
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  // TODO: Add task to tasks array
  
  // TODO: Return created task with 201 status
});
```

### Task Part C: Implement PUT Route

```typescript
// TODO: PUT /tasks/:id - Update a task
router.put('/:id', (req: Request, res: Response) => {
  // TODO: Type request params and body
  // Hint: Request<{ id: string }, {}, UpdateTaskDto>
  
  const { id } = req.params;
  
  // TODO: Find task index in array
  const taskIndex = tasks.findIndex(t => t.id === id);
  
  // TODO: If not found, return 404
  
  // TODO: Update task with new data (merge with existing)
  // Update the updatedAt timestamp
  // Hint: tasks[taskIndex] = { ...tasks[taskIndex], ...req.body, updatedAt: new Date() }
  
  // TODO: Return updated task with 200 status
});
```

### Task Part D: Add Update Types to Model

Update `src/models/task.model.ts`:

```typescript
// Add these type definitions

// Type for creating a task
export type CreateTaskDto = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;

// Type for updating a task (all fields optional)
export type UpdateTaskDto = Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>;
```

### Test Your Routes
```bash
# Create a new task
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Build REST API","description":"Complete Lab 3","status":"IN_PROGRESS","priority":"high"}'

# Update a task (replace {id} with actual ID)
curl -X PUT http://localhost:3000/api/tasks/{id} \
  -H "Content-Type: application/json" \
  -d '{"status":"COMPLETED"}'

# Try creating task without title
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"description":"This should fail"}'
```

### Hints
- Type request body: `Request<ParamsType, ResBodyType, ReqBodyType>`
- Validation: Check if required fields exist before processing
- Merge objects: `{ ...oldObject, ...newObject }`
- Status 201: Used for "Created"
- Status 400: Used for "Bad Request"

### Questions to Consider
1. Why use DTOs (Data Transfer Objects) for requests?
2. What's the benefit of `Partial<T>` for update operations?
3. How do you handle optional fields with default values?

---

## Exercise 4: DELETE Route & Custom Middleware

### Objective
Complete CRUD operations and create custom middleware for logging and validation.

**What you'll do:**
- ✓ Implement DELETE route
- ✓ Create logging middleware
- ✓ Create validation middleware
- ✓ Apply middleware to routes

### Task Part A: Implement DELETE Route

Update `src/routes/task.routes.ts`:

```typescript
// TODO: DELETE /tasks/:id - Delete a task
router.delete('/:id', (req: Request, res: Response) => {
  // TODO: Get id from params
  const { id } = req.params;
  
  // TODO: Find task index
  const taskIndex = tasks.findIndex(t => t.id === id);
  
  // TODO: If not found, return 404
  
  // TODO: Remove task from array
  // Hint: tasks.splice(taskIndex, 1)
  
  // TODO: Return 204 status (No Content) or 200 with success message
  res.status(204).send();
});
```

### Task Part B: Create Logging Middleware

Create `src/middleware/logger.middleware.ts`:

```typescript
import { Request, Response, NextFunction } from 'express';

// TODO: Create a logging middleware
export function logger(req: Request, res: Response, next: NextFunction) {
  // TODO: Log the request method and URL
  // Format: [TIMESTAMP] METHOD URL
  // Example: [2024-02-10T10:30:00.000Z] GET /api/tasks
  
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
  // TODO: Call next() to pass control to the next middleware
}
```

### Task Part C: Create Validation Middleware

Create `src/middleware/validation.middleware.ts`:

```typescript
import { Request, Response, NextFunction } from 'express';

// TODO: Create middleware to validate task creation
export function validateTaskCreation(req: Request, res: Response, next: NextFunction) {
  const { title } = req.body;
  
  // TODO: Check if title exists and is not empty
  if (!title || title.trim() === '') {
    // TODO: Return 400 error with message
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Title is required and cannot be empty'
    });
  }
  
  // TODO: Validate priority if provided
  // Must be one of: low, medium, high
  
  // TODO: Validate status if provided
  // Must be one of: PENDING, IN_PROGRESS, COMPLETED
  
  // TODO: If all validations pass, call next()
  next();
}

// TODO: Create middleware to validate UUID format
export function validateUUID(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  
  // Simple UUID v4 regex pattern
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  
  // TODO: Test if id matches UUID format
  if (!uuidRegex.test(id)) {
    // TODO: Return 400 with error message
  }
  
  // TODO: If valid, call next()
  next();
}
```

### Task Part D: Apply Middleware

Update `src/server.ts` and `src/routes/task.routes.ts`:

```typescript
// In server.ts
import { logger } from './middleware/logger.middleware';

// TODO: Apply logger middleware globally
app.use(logger);

// In task.routes.ts
import { validateTaskCreation, validateUUID } from '../middleware/validation.middleware';

// TODO: Apply validation middleware to specific routes
// POST route: use validateTaskCreation
router.post('/', validateTaskCreation, (req, res) => {
  // ... existing code
});

// PUT, GET by ID, DELETE routes: use validateUUID
router.get('/:id', validateUUID, (req, res) => {
  // ... existing code
});
```

### Test Your Routes
```bash
# Delete a task
curl -X DELETE http://localhost:3000/api/tasks/{id}

# Try with invalid UUID
curl -X DELETE http://localhost:3000/api/tasks/invalid-id

# Try creating task without title
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"description":"No title"}'
```

### Hints
- Middleware signature: `(req, res, next) => void`
- Always call `next()` to continue the chain
- Return early to stop execution: `return res.status(...).json(...)`
- Apply middleware: `router.method(path, middleware1, middleware2, handler)`
- Status 204: No content (successful delete)

### Questions to Consider
1. What's the difference between app-level and router-level middleware?
2. Why is it important to call `next()` in middleware?
3. When should you return vs call next() in middleware?

---

## Exercise 5: Centralized Error Handling

### Objective
Implement robust error handling with custom error classes and a centralized error handler.

**What you'll do:**
- ✓ Create custom error classes
- ✓ Implement error handling middleware
- ✓ Handle async errors properly
- ✓ Return consistent error responses

### Task Part A: Create Custom Error Classes

Create `src/middleware/errors.middleware.ts`:

```typescript
// TODO: Create a custom error class for API errors
export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    // Maintains proper stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

// TODO: Create specific error classes

export class NotFoundError extends ApiError {
  constructor(message: string = 'Resource not found') {
    super(404, message);
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string = 'Bad request') {
    super(400, message);
  }
}

export class ValidationError extends ApiError {
  constructor(message: string = 'Validation failed') {
    super(400, message);
  }
}
```

### Task Part B: Create Error Handler Middleware

```typescript
import { Request, Response, NextFunction } from 'express';

// TODO: Create centralized error handler middleware
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // TODO: Check if error is an ApiError
  if (err instanceof ApiError) {
    // TODO: Return formatted error response
    return res.status(err.statusCode).json({
      status: 'error',
      statusCode: err.statusCode,
      message: err.message
    });
  }
  
  // TODO: Handle unexpected errors (500)
  console.error('Unexpected error:', err);
  
  return res.status(500).json({
    status: 'error',
    statusCode: 500,
    message: 'Internal server error'
  });
}

// TODO: Create async error wrapper to catch Promise rejections
export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
```

### Task Part C: Use Errors in Routes

Update `src/routes/task.routes.ts`:

```typescript
import { NotFoundError, BadRequestError } from '../middleware/errors.middleware';
import { asyncHandler } from '../middleware/errors.middleware';

// TODO: Update GET by ID to throw error instead of returning 404
router.get('/:id', validateUUID, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const task = tasks.find(t => t.id === id);
  
  if (!task) {
    throw new NotFoundError(`Task with id ${id} not found`);
  }
  
  res.json(task);
}));

// TODO: Update PUT route to throw errors
router.put('/:id', validateUUID, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const taskIndex = tasks.findIndex(t => t.id === id);
  
  if (taskIndex === -1) {
    throw new NotFoundError(`Task with id ${id} not found`);
  }
  
  tasks[taskIndex] = {
    ...tasks[taskIndex],
    ...req.body,
    updatedAt: new Date()
  };
  
  res.json(tasks[taskIndex]);
}));

// TODO: Update DELETE route
router.delete('/:id', validateUUID, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const taskIndex = tasks.findIndex(t => t.id === id);
  
  if (taskIndex === -1) {
    throw new NotFoundError(`Task with id ${id} not found`);
  }
  
  tasks.splice(taskIndex, 1);
  res.status(204).send();
}));
```

### Task Part D: Register Error Handler

Update `src/server.ts`:

```typescript
import { errorHandler } from './middleware/errors.middleware';

// ... existing code ...

app.use('/api/tasks', taskRoutes);

// TODO: Add 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    statusCode: 404,
    message: 'Route not found'
  });
});

// TODO: Register error handler (MUST be last middleware)
app.use(errorHandler);
```

### Test Error Handling
```bash
# Test 404 error
curl http://localhost:3000/api/tasks/00000000-0000-4000-8000-000000000000

# Test invalid UUID
curl http://localhost:3000/api/tasks/invalid-id

# Test unknown route
curl http://localhost:3000/api/unknown
```

### Hints
- Error middleware has 4 parameters: `(err, req, res, next)`
- Error handler must be registered LAST
- Use `instanceof` to check error type
- `asyncHandler` catches Promise rejections automatically
- Throw errors instead of returning responses for cleaner code

### Questions to Consider
1. Why is centralized error handling better than handling errors in each route?
2. What's the difference between operational and programmer errors?
3. Why must the error handler be the last middleware?

---

## Exercise 6: Service Layer & Better Architecture

### Objective
Refactor code into a proper layered architecture with controllers and services.

**What you'll do:**
- ✓ Create a service layer for business logic
- ✓ Create controllers to handle requests
- ✓ Separate concerns properly
- ✓ Make code more testable and maintainable

### Task Part A: Create Task Service

Create `src/services/task.service.ts`:

```typescript
import { v4 as uuidv4 } from 'uuid';
import { Task, CreateTaskDto, UpdateTaskDto } from '../models/task.model';
import { NotFoundError } from '../middleware/errors.middleware';

// In-memory storage
let tasks: Task[] = [];

export class TaskService {
  // TODO: Get all tasks
  static getAllTasks(): Task[] {
    return tasks;
  }
  
  // TODO: Get task by ID
  static getTaskById(id: string): Task {
    const task = tasks.find(t => t.id === id);
    
    if (!task) {
      throw new NotFoundError(`Task with id ${id} not found`);
    }
    
    return task;
  }
  
  // TODO: Create task
  static createTask(data: CreateTaskDto): Task {
    const newTask: Task = {
      id: uuidv4(),
      ...data,
      description: data.description || '',
      status: data.status || 'PENDING',
      priority: data.priority || 'medium',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    tasks.push(newTask);
    return newTask;
  }
  
  // TODO: Update task
  static updateTask(id: string, data: UpdateTaskDto): Task {
    const taskIndex = tasks.findIndex(t => t.id === id);
    
    if (taskIndex === -1) {
      throw new NotFoundError(`Task with id ${id} not found`);
    }
    
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...data,
      updatedAt: new Date()
    };
    
    return tasks[taskIndex];
  }
  
  // TODO: Delete task
  static deleteTask(id: string): void {
    const taskIndex = tasks.findIndex(t => t.id === id);
    
    if (taskIndex === -1) {
      throw new NotFoundError(`Task with id ${id} not found`);
    }
    
    tasks.splice(taskIndex, 1);
  }
  
  // TODO: Filter tasks by status
  static filterTasksByStatus(status: string): Task[] {
    // Implementation here
  }
  
  // TODO: Filter tasks by priority
  static filterTasksByPriority(priority: string): Task[] {
    // Implementation here
  }
}
```

### Task Part B: Create Task Controller

Create `src/controllers/task.controller.ts`:

```typescript
import { Request, Response } from 'express';
import { TaskService } from '../services/task.service';
import { CreateTaskDto, UpdateTaskDto } from '../models/task.model';

export class TaskController {
  // TODO: Get all tasks
  static async getAllTasks(req: Request, res: Response) {
    // TODO: Get query parameters for filtering
    const { status, priority } = req.query;
    
    let tasks;
    
    // TODO: Apply filters if provided
    if (status) {
      tasks = TaskService.filterTasksByStatus(status as string);
    } else if (priority) {
      tasks = TaskService.filterTasksByPriority(priority as string);
    } else {
      tasks = TaskService.getAllTasks();
    }
    
    res.json({
      status: 'success',
      count: tasks.length,
      data: tasks
    });
  }
  
  // TODO: Get task by ID
  static async getTaskById(req: Request, res: Response) {
    const { id } = req.params;
    const task = TaskService.getTaskById(id);
    
    res.json({
      status: 'success',
      data: task
    });
  }
  
  // TODO: Create task
  static async createTask(req: Request<{}, {}, CreateTaskDto>, res: Response) {
    const task = TaskService.createTask(req.body);
    
    res.status(201).json({
      status: 'success',
      data: task
    });
  }
  
  // TODO: Update task
  static async updateTask(req: Request<{ id: string }, {}, UpdateTaskDto>, res: Response) {
    const { id } = req.params;
    const task = TaskService.updateTask(id, req.body);
    
    res.json({
      status: 'success',
      data: task
    });
  }
  
  // TODO: Delete task
  static async deleteTask(req: Request, res: Response) {
    const { id } = req.params;
    TaskService.deleteTask(id);
    
    res.status(204).send();
  }
}
```

### Task Part C: Update Routes to Use Controller

Update `src/routes/task.routes.ts`:

```typescript
import express from 'express';
import { TaskController } from '../controllers/task.controller';
import { asyncHandler } from '../middleware/errors.middleware';
import { validateTaskCreation, validateUUID } from '../middleware/validation.middleware';

const router = express.Router();

// TODO: Use controller methods instead of inline handlers
router.get('/', asyncHandler(TaskController.getAllTasks));
router.get('/:id', validateUUID, asyncHandler(TaskController.getTaskById));
router.post('/', validateTaskCreation, asyncHandler(TaskController.createTask));
router.put('/:id', validateUUID, asyncHandler(TaskController.updateTask));
router.delete('/:id', validateUUID, asyncHandler(TaskController.deleteTask));

export default router;
```

### Test with Query Parameters
```bash
# Get all tasks
curl http://localhost:3000/api/tasks

# Filter by status
curl "http://localhost:3000/api/tasks?status=COMPLETED"

# Filter by priority
curl "http://localhost:3000/api/tasks?priority=high"
```

### Hints
- Controllers handle HTTP requests/responses
- Services contain business logic
- Keep routes thin - just wire controllers
- Use static methods for stateless services
- Type query parameters: `Request<{}, {}, {}, QueryType>`

### Questions to Consider
1. What are the benefits of separating concerns into layers?
2. Why keep business logic out of routes?
3. How does this architecture make testing easier?

---

## Bonus Challenge: MongoDB Integration

### Objective
Replace in-memory storage with a real MongoDB database using Mongoose.

**What you'll do:**
- ✓ Install and configure Mongoose
- ✓ Create a Mongoose schema
- ✓ Update service to use MongoDB
- ✓ Handle database errors

### Setup

```bash
npm install mongoose
npm install --save-dev @types/mongoose
```

### Task Part A: Create Database Configuration

Create `src/config/database.ts`:

```typescript
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/taskdb';

export async function connectDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB');
  } catch (error) {
    console.error('✗ MongoDB connection error:', error);
    process.exit(1);
  }
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
  console.log('✓ Disconnected from MongoDB');
}
```

### Task Part B: Create Mongoose Schema

Create `src/models/task.schema.ts`:

```typescript
import mongoose, { Schema, Document } from 'mongoose';
import { Task } from './task.model';

// TODO: Extend Task interface with Document for Mongoose
export interface TaskDocument extends Task, Document {}

// TODO: Create Mongoose schema
const TaskSchema = new Schema<TaskDocument>({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  status: {
    type: String,
    enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'],
    default: 'PENDING'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// TODO: Add pre-save middleware to update timestamps
TaskSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const TaskModel = mongoose.model<TaskDocument>('Task', TaskSchema);
```

### Task Part C: Update Service to Use MongoDB

Update `src/services/task.service.ts`:

```typescript
import { TaskModel } from '../models/task.schema';
import { Task, CreateTaskDto, UpdateTaskDto } from '../models/task.model';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundError } from '../middleware/errors.middleware';

export class TaskService {
  // TODO: Get all tasks from MongoDB
  static async getAllTasks(): Promise<Task[]> {
    return await TaskModel.find();
  }
  
  // TODO: Get task by ID
  static async getTaskById(id: string): Promise<Task> {
    const task = await TaskModel.findOne({ id });
    
    if (!task) {
      throw new NotFoundError(`Task with id ${id} not found`);
    }
    
    return task;
  }
  
  // TODO: Create task
  static async createTask(data: CreateTaskDto): Promise<Task> {
    const newTask = new TaskModel({
      id: uuidv4(),
      ...data
    });
    
    return await newTask.save();
  }
  
  // TODO: Update task
  static async updateTask(id: string, data: UpdateTaskDto): Promise<Task> {
    const task = await TaskModel.findOneAndUpdate(
      { id },
      { ...data, updatedAt: new Date() },
      { new: true }
    );
    
    if (!task) {
      throw new NotFoundError(`Task with id ${id} not found`);
    }
    
    return task;
  }
  
  // TODO: Delete task
  static async deleteTask(id: string): Promise<void> {
    const result = await TaskModel.deleteOne({ id });
    
    if (result.deletedCount === 0) {
      throw new NotFoundError(`Task with id ${id} not found`);
    }
  }
  
  // TODO: Implement filter methods
  static async filterTasksByStatus(status: string): Promise<Task[]> {
    return await TaskModel.find({ status });
  }
  
  static async filterTasksByPriority(priority: string): Promise<Task[]> {
    return await TaskModel.find({ priority });
  }
}
```

### Task Part D: Connect Database in Server

Update `src/server.ts`:

```typescript
import express from 'express';
import { connectDatabase } from './config/database';
import taskRoutes from './routes/task.routes';
import { logger } from './middleware/logger.middleware';
import { errorHandler } from './middleware/errors.middleware';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(logger);

// Routes
app.get('/', (req, res) => {
  res.json({ message: "Welcome to Task API", version: "2.0.0" });
});

app.use('/api/tasks', taskRoutes);

// Error handling
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    statusCode: 404,
    message: 'Route not found'
  });
});

app.use(errorHandler);

// Start server with database connection
async function startServer() {
  try {
    // TODO: Connect to database first
    await connectDatabase();
    
    // TODO: Then start server
    app.listen(PORT, () => {
      console.log(`✓ Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
```

### Test with MongoDB

```bash
# Make sure MongoDB is running
# Then start your server
npm run dev

# Test CRUD operations - data will persist!
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Persistent Task","description":"Stored in MongoDB","status":"PENDING","priority":"high"}'
```

### Hints
- Mongoose methods are async - always use `await`
- `findOneAndUpdate` with `{ new: true }` returns updated document
- Check `deletedCount` to verify deletion
- Handle database errors in error handler
- Use environment variables for connection string

---

## Learning Outcomes

After completing this lab, you should be able to:

- ✅ Set up Express.js with TypeScript
- ✅ Create type-safe REST API routes (GET, POST, PUT, DELETE)
- ✅ Define data models with TypeScript interfaces
- ✅ Type request parameters, body, and query strings
- ✅ Implement custom middleware for validation and logging
- ✅ Handle errors with centralized error handler
- ✅ Structure code in layers (routes, controllers, services)
- ✅ Implement CRUD operations
- ✅ Integrate MongoDB with Mongoose (bonus)
- ✅ Apply async/await patterns from Lab 1
- ✅ Use TypeScript generics and utility types from Lab 2

## API Documentation

### Endpoints

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| GET | /api/tasks | Get all tasks | - |
| GET | /api/tasks?status=PENDING | Filter by status | - |
| GET | /api/tasks?priority=high | Filter by priority | - |
| GET | /api/tasks/:id | Get task by ID | - |
| POST | /api/tasks | Create task | CreateTaskDto |
| PUT | /api/tasks/:id | Update task | UpdateTaskDto |
| DELETE | /api/tasks/:id | Delete task | - |

### Response Format

**Success Response:**
```json
{
  "status": "success",
  "data": { ... } or [ ... ],
  "count": 10  // For list endpoints
}
```

**Error Response:**
```json
{
  "status": "error",
  "statusCode": 400,
  "message": "Error description"
}
```

## Best Practices

- [ ] Use TypeScript strict mode
- [ ] Type all request/response objects
- [ ] Validate input data before processing
- [ ] Use centralized error handling
- [ ] Separate concerns (routes, controllers, services)
- [ ] Use async/await for asynchronous operations
- [ ] Return appropriate HTTP status codes
- [ ] Log important operations
- [ ] Handle edge cases (not found, validation errors)
- [ ] Use environment variables for configuration

## Common HTTP Status Codes

| Code | Meaning | When to Use |
|------|---------|-------------|
| 200 | OK | Successful GET, PUT |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Validation error |
| 404 | Not Found | Resource doesn't exist |
| 500 | Internal Server Error | Unexpected error |

## Testing Tips

Use VS Code extensions:
- **REST Client** - Create `.http` files with requests
- **Thunder Client** - Postman alternative
- **Postman** - Full-featured API testing

Example `.http` file:
```http
### Get all tasks
GET http://localhost:3000/api/tasks

### Create task
POST http://localhost:3000/api/tasks
Content-Type: application/json

{
  "title": "Test Task",
  "description": "Testing API",
  "status": "PENDING",
  "priority": "high"
}

### Get task by ID
GET http://localhost:3000/api/tasks/{{taskId}}
```

## Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [TypeScript Express Types](https://www.npmjs.com/package/@types/express)
- [Mongoose Documentation](https://mongoosejs.com/)
- [REST API Best Practices](https://restfulapi.net/)
- [HTTP Status Codes](https://httpstatuses.com/)
