# Lab 2: TypeScript Fundamentals

## Overview
This lab introduces TypeScript's core features through hands-on exercises. You'll learn type annotations, interfaces, functions, classes, and essential type system features that every TypeScript developer must know.

---

## Setup

### 1. Install TypeScript
```bash
npm install -g typescript ts-node
```

### 2. Initialize a TypeScript project
```bash
mkdir lab2-exercises
cd lab2-exercises
npm init -y
npm install --save-dev typescript @types/node
npx tsc --init
```

### 3. Configure tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### 4. Run TypeScript files
```bash
# Compile and run
npx tsc && node dist/file.js

# Or use ts-node for quick testing
npx ts-node src/file.ts
```

---

## Exercise 1: Basic Types & Type Annotations

### Objective
Understand TypeScript's primitive types and how to annotate variables, parameters, and return values.

### Task
Create a file `src/ex1-basic-types.ts` and implement type-safe functions.

### Starter Code

```typescript
// TODO: Add type annotations to these variables
let username = "Alice";
let age = 30;
let isActive = true;
let score = null;

// TODO: Fix this function by adding proper type annotations
function greet(name, age) {
  return `Hello ${name}, you are ${age} years old`;
}

// TODO: Add return type annotation
function calculateArea(width, height) {
  return width * height;
}

// TODO: Type this array properly
let numbers = [1, 2, 3, 4, 5];

// TODO: Type this array of mixed types
let mixed = [1, "hello", true];

// TODO: Create a tuple for coordinates [x, y]
let coordinates;

// Test your functions
console.log(greet("Bob", 25));
console.log(calculateArea(10, 5));
```

### Hints
- Use `: type` syntax after variable/parameter names
- Array types: `number[]` or `Array<number>`
- Tuple types: `[type1, type2]`
- Return type: `function name(): returnType`

### Questions to Consider
1. What happens if you try to assign a string to a number variable?
2. What's the difference between `any` and `unknown`?
3. When would you use `void` vs `undefined` as a return type?

---

## Exercise 2: Interfaces & Type Aliases

### Objective
Learn to define object shapes using interfaces and type aliases.

### Task
Model a user management system with proper type definitions.

### Starter Code

```typescript
// TODO: Define an interface for User
// Properties: id (number), name (string), email (string), isAdmin (boolean)

// TODO: Define an interface for Address
// Properties: street (string), city (string), zipCode (string), country (string)

// TODO: Extend User interface to include optional address property

// TODO: Create a type alias for UserRole (union type: "admin" | "user" | "guest")

// TODO: Define an interface for a function type that validates email
// Should take a string and return boolean

// Example usage:
function createUser(id, name, email) {
  // TODO: Add parameter types
  return {
    id,
    name,
    email,
    isAdmin: false
  };
}

function printUser(user) {
  // TODO: Add parameter type
  console.log(`${user.name} (${user.email})`);
  if (user.address) {
    console.log(`Located in: ${user.address.city}, ${user.address.country}`);
  }
}

// Test
const user1 = createUser(1, "Alice", "alice@example.com");
printUser(user1);
```

### Hints
- Use `interface` for object shapes
- Optional properties: `property?: type`
- Extending interfaces: `interface Child extends Parent { ... }`
- Type aliases: `type Name = ...`
- Union types: `type1 | type2`

### Questions to Consider
1. When should you use `interface` vs `type`?
2. What's the benefit of marking properties as optional?
3. How do you handle nested objects?

---

## Exercise 3: Functions & Generics

### Objective
Master function typing, optional/default parameters, and generic functions.

### Task
Create utility functions with proper type safety.

### Starter Code

```typescript
// TODO: Add types to function parameters and return value
function add(a, b) {
  return a + b;
}

// TODO: Add optional parameter 'decimals' with default value 2
function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}

// TODO: Create a generic function that returns the first element of an array
function getFirst(arr) {
  return arr[0];
}

// TODO: Create a generic function that returns the last element
function getLast(arr) {
  // Implementation here
}

// TODO: Create a generic function to swap two values in a tuple
function swap(pair) {
  return [pair[1], pair[0]];
}

// TODO: Create a function that takes a callback
// The callback receives a number and returns a string
function processNumbers(numbers, callback) {
  return numbers.map(callback);
}

// Test your functions
console.log(add(5, 10));
console.log(formatPrice(99.9, 2));
console.log(getFirst([1, 2, 3]));
console.log(getFirst(["a", "b", "c"]));
console.log(swap([1, "hello"]));
```

### Hints
- Optional parameters: `param?: type`
- Default parameters: `param: type = defaultValue`
- Generic syntax: `function name<T>(param: T): T`
- Function type: `(param: type) => returnType`

### Questions to Consider
1. Why use generics instead of `any`?
2. How does TypeScript infer generic types?
3. What's the difference between optional and default parameters?

---

## Exercise 4: Classes & Access Modifiers

### Objective
Build object-oriented code with classes, inheritance, and access control.

### Task
Create a class hierarchy for a simple banking system.

### Starter Code

```typescript
// TODO: Create a BankAccount class with:
// - private property: balance (number)
// - public property: accountNumber (string)
// - readonly property: owner (string)
// - constructor to initialize all properties
// - public method: deposit(amount: number): void
// - public method: withdraw(amount: number): boolean
// - public method: getBalance(): number

class BankAccount {
  // TODO: Add properties and constructor
  
  // TODO: Implement deposit method
  
  // TODO: Implement withdraw method (return false if insufficient funds)
  
  // TODO: Implement getBalance method
}

// TODO: Create a SavingsAccount class that extends BankAccount
// - Add private property: interestRate (number)
// - Add method: applyInterest(): void

class SavingsAccount {
  // TODO: Implement
}

// TODO: Create a CheckingAccount class that extends BankAccount
// - Add private property: overdraftLimit (number)
// - Override withdraw to allow overdraft up to the limit

class CheckingAccount {
  // TODO: Implement
}

// Test your classes
const account = new BankAccount("123456", "Alice", 1000);
account.deposit(500);
console.log(account.getBalance()); // 1500

const savings = new SavingsAccount("789012", "Bob", 5000, 0.03);
savings.applyInterest();
console.log(savings.getBalance()); // 5150
```

### Hints
- Access modifiers: `public`, `private`, `protected`, `readonly`
- Constructor: `constructor(params) { ... }`
- Inheritance: `class Child extends Parent { ... }`
- Call parent constructor: `super(params)`
- Override methods: just redefine them in child class

### Questions to Consider
1. What's the difference between `private` and `protected`?
2. When should you use `readonly`?
3. Why can't you access private properties outside the class?

---

## Exercise 5: Enums & Literal Types

### Objective
Use enums and literal types for type-safe constants and restricted values.

### Task
Create a task management system with status tracking.

### Starter Code

```typescript
// TODO: Create an enum for TaskStatus
// Values: TODO, IN_PROGRESS, DONE, CANCELLED

// TODO: Create a string literal type for Priority
// Values: "low" | "medium" | "high" | "urgent"

// TODO: Create an interface for Task
// Properties:
// - id: number
// - title: string
// - status: TaskStatus (enum)
// - priority: Priority (literal type)
// - createdAt: Date
// - completedAt?: Date (optional)

// TODO: Implement a function that changes task status
function updateTaskStatus(task, newStatus) {
  // Validate status transitions:
  // - Can't go from DONE to TODO
  // - Can't change if CANCELLED
  
  // TODO: Add validation logic
  
  if (newStatus === "DONE") {
    task.completedAt = new Date();
  }
  
  task.status = newStatus;
  return task;
}

// TODO: Implement a function to filter tasks by priority
function filterByPriority(tasks, priority) {
  // TODO: Return tasks matching the priority
}

// TODO: Implement a function that returns a human-readable status
function getStatusLabel(status) {
  // TODO: Use switch statement to return labels
  // TODO "To Do", IN_PROGRESS -> "In Progress", etc.
}

// Test
const task1 = {
  id: 1,
  title: "Learn TypeScript",
  status: "TODO", // TODO: Use enum value
  priority: "high",
  createdAt: new Date()
};

console.log(getStatusLabel(task1.status));
```

### Hints
- String enum: `enum Name { Value1 = "value1", Value2 = "value2" }`
- Numeric enum: `enum Name { Value1, Value2 }` (auto-increments from 0)
- Literal types: `type Name = "value1" | "value2"`
- Use enums for related constants, literals for simple choices

### Questions to Consider
1. What's the difference between string enums and literal types?
2. When would you prefer enums over literals?
3. How does TypeScript compile enums to JavaScript?

---

## Exercise 6: Union & Intersection Types

### Objective
Combine types using union (`|`) and intersection (`&`) operators.

### Task
Build a flexible API response handling system.

### Starter Code

```typescript
// TODO: Define types for API responses

// Success response type
interface SuccessResponse {
  // TODO: Add properties
  // - success: true
  // - data: any (we'll make this generic later)
  // - timestamp: Date
}

// Error response type
interface ErrorResponse {
  // TODO: Add properties
  // - success: false
  // - error: string
  // - code: number
  // - timestamp: Date
}

// TODO: Create a union type ApiResponse = SuccessResponse | ErrorResponse

// TODO: Create an intersection type for a logged user
// Combine User (from Exercise 2) with a LoginInfo type
interface LoginInfo {
  lastLogin: Date;
  loginCount: number;
}

// type LoggedInUser = ...

// TODO: Implement a type guard function to check if response is successful
function isSuccess(response) {
  // TODO: Add parameter type and return type (type predicate)
  // Hint: use "is" keyword
}

// TODO: Handle API response based on its type
function handleResponse(response) {
  // TODO: Add parameter type
  
  if (isSuccess(response)) {
    // TypeScript knows this is SuccessResponse here
    console.log("Data:", response.data);
  } else {
    // TypeScript knows this is ErrorResponse here
    console.log("Error:", response.error);
  }
}

// Test
const success = {
  success: true,
  data: { user: "Alice" },
  timestamp: new Date()
};

const error = {
  success: false,
  error: "Not found",
  code: 404,
  timestamp: new Date()
};

handleResponse(success);
handleResponse(error);
```

### Hints
- Union: `type A | type B` (can be A OR B)
- Intersection: `type A & type B` (must be A AND B)
- Type guard: `function isType(obj: any): obj is Type { ... }`
- Discriminated unions: use a common property to distinguish types

### Questions to Consider
1. What's the difference between union and intersection types?
2. How does TypeScript narrow types in conditional blocks?
3. What are discriminated unions and why are they useful?

---

## Exercise 7: Working with External Libraries

### Objective
Understand how to work with third-party libraries and type definitions.

### Task
Use typed versions of common Node.js modules and external packages.

### Setup
```bash
npm install axios
npm install --save-dev @types/node
```

### Starter Code

```typescript
import axios from 'axios';
import * as fs from 'fs/promises';

// TODO: Define an interface for the API response data
// Use https://jsonplaceholder.typicode.com/users as reference

interface User {
  // TODO: Add properties based on API response
}

// TODO: Create a typed function to fetch users
async function fetchUsers() {
  // TODO: Add return type Promise<User[]>
  
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/users');
    // TODO: Type the response properly
    return response.data;
  } catch (error) {
    // TODO: Handle error with proper typing
    throw error;
  }
}

// TODO: Create a function to read and parse JSON file
async function readJsonFile(filePath) {
  // TODO: Add type parameters for generic JSON type
  // TODO: Add return type
  
  const content = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(content);
}

// TODO: Create a function to write JSON file
async function writeJsonFile(filePath, data) {
  // TODO: Add types
  
  const jsonString = JSON.stringify(data, null, 2);
  await fs.writeFile(filePath, jsonString);
}

// Test
async function main() {
  try {
    const users = await fetchUsers();
    console.log(`Fetched ${users.length} users`);
    
    await writeJsonFile('users.json', users);
    const readData = await readJsonFile('users.json');
    console.log('Data saved and read successfully');
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
```

### Hints
- Install types: `npm install --save-dev @types/package-name`
- Check DefinitelyTyped for available type definitions
- Use generics for flexible typed functions: `Promise<T>`
- Import types: `import type { TypeName } from 'package'`

### Questions to Consider
1. What are `@types` packages?
2. How do you find type definitions for a package?
3. What if a package doesn't have type definitions?

---

## Bonus Challenge: Type-Safe REST API Client

### Objective
Build a complete type-safe API client combining all concepts.

### Task
Create a reusable API client with full type safety for a blog system.

### Requirements
- Define interfaces for all entities (Post, Comment, User)
- Create generic API client with CRUD operations
- Implement error handling with custom error types
- Use enums for HTTP methods
- Add type guards for response validation
- Make it work with the JSONPlaceholder API

### Starter Code

```typescript
import axios, { AxiosInstance } from 'axios';

// TODO: Define entity interfaces
interface Post {
  // TODO: id, userId, title, body
}

interface Comment {
  // TODO: postId, id, name, email, body
}

// TODO: Create HttpMethod enum

// TODO: Create ApiError class

// TODO: Create generic ApiClient class
class ApiClient<T> {
  private axiosInstance: AxiosInstance;
  private endpoint: string;

  constructor(baseURL: string, endpoint: string) {
    // TODO: Initialize axios instance
    // TODO: Store endpoint
  }

  // TODO: Implement getAll(): Promise<T[]>
  
  // TODO: Implement getById(id: number): Promise<T>
  
  // TODO: Implement create(data: Omit<T, 'id'>): Promise<T>
  
  // TODO: Implement update(id: number, data: Partial<T>): Promise<T>
  
  // TODO: Implement delete(id: number): Promise<void>
}

// TODO: Create specialized clients
const postsClient = new ApiClient<Post>('https://jsonplaceholder.typicode.com', '/posts');
const commentsClient = new ApiClient<Comment>('https://jsonplaceholder.typicode.com', '/comments');

// TODO: Test the client
async function demo() {
  try {
    // Get all posts
    const posts = await postsClient.getAll();
    console.log(`Found ${posts.length} posts`);
    
    // Get single post
    const post = await postsClient.getById(1);
    console.log('Post:', post.title);
    
    // Create new post
    const newPost = await postsClient.create({
      userId: 1,
      title: 'TypeScript is awesome',
      body: 'Learning TypeScript with hands-on exercises'
    });
    console.log('Created:', newPost);
    
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`API Error ${error.statusCode}:`, error.message);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}

demo();
```

---

## Learning Outcomes

After completing this lab, you should be able to:

- ✅ Annotate variables, functions, and return types
- ✅ Define object shapes with interfaces and type aliases
- ✅ Write type-safe functions with proper parameter and return types
- ✅ Use optional and default parameters
- ✅ Create and use generic functions for reusable code
- ✅ Build classes with proper access modifiers and inheritance
- ✅ Use enums and literal types for restricted values
- ✅ Combine types with unions and intersections
- ✅ Create type guards for runtime type checking
- ✅ Work with external libraries and type definitions
- ✅ Build type-safe applications with full IntelliSense support

## Best Practices

- [ ] Enable `strict` mode in tsconfig.json
- [ ] Avoid using `any` unless absolutely necessary
- [ ] Use `unknown` instead of `any` when type is truly unknown
- [ ] Prefer interfaces for object shapes that may be extended
- [ ] Use type aliases for unions, intersections, and complex types
- [ ] Make use of type inference - don't over-annotate
- [ ] Use generics for reusable, type-safe code
- [ ] Create type guards for runtime validation
- [ ] Install `@types` packages for third-party libraries

## Common Pitfalls

⚠️ **Using `any` everywhere** - defeats the purpose of TypeScript
⚠️ **Type assertions (`as`)** - use sparingly, prefer type guards
⚠️ **Ignoring compiler errors** - they're there to help
⚠️ **Not using strict mode** - catches more potential bugs
⚠️ **Over-complicating types** - keep them simple and readable

## Additional Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Playground](https://www.typescriptlang.org/play)
- [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
