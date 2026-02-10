# Lab 1: Asynchronous Patterns in Node.js

## Overview
This lab will guide you through practicing callback patterns, Promises, async/await, parallelism patterns, and error handling in asynchronous JavaScript code.

---

## Exercise 1: Callbacks - Reading Files Sequentially

### Objective
Understand callback patterns and experience "callback hell" firsthand.

### Task
Create a Node.js script that reads three text files sequentially using callbacks and displays their content in order.

### Setup
First, create three sample text files:

```bash
echo "First file content" > file1.txt
echo "Second file content" > file2.txt
echo "Third file content" > file3.txt
```

### Starter Code

```javascript
const fs = require('fs');

// TODO: Read file1.txt, then file2.txt, then file3.txt
// Display each file's content in sequence
// Handle errors appropriately

fs.readFile('file1.txt', 'utf8', (err, data1) => {
  if (err) {
    console.error('Error reading file1:', err);
    return;
  }
  console.log('File 1:', data1);
  
  // TODO: Nest the next readFile call here
  // Continue the pattern for file3.txt
});
```

### Hint
Notice how the code becomes nested and difficult to read. This is "callback hell". Each subsequent file read must be inside the callback of the previous one to maintain order.

### Challenge
Modify your solution to also count the total number of characters across all three files.

---

## Exercise 2: Promises - Fetching APIs Sequentially

### Objective
Refactor callback-based code to use Promises with `.then()` and `.catch()` chaining.

### Task
Create a script that fetches data from multiple APIs sequentially using Promises.

### Starter Code

```javascript
const https = require('https');

// Helper function to make HTTP GET requests returning a Promise
function fetchData(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// TODO: Use fetchData to fetch from these URLs sequentially:
// 1. https://jsonplaceholder.typicode.com/users/1
// 2. https://jsonplaceholder.typicode.com/posts/1
// 3. https://jsonplaceholder.typicode.com/comments/1

// Example structure:
fetchData('https://jsonplaceholder.typicode.com/users/1')
  .then(user => {
    console.log('User:', user.name);
    // TODO: Chain the next fetch here
    return fetchData('https://jsonplaceholder.typicode.com/posts/1');
  })
  .then(post => {
    // TODO: Continue the chain
  })
  .catch(error => {
    // TODO: Handle any errors in the chain
  });
```

### Hint
Promises allow you to avoid nested callbacks. Each `.then()` returns a new Promise, allowing flat chaining.

### Questions to Consider
1. What is the state of each Promise before, during, and after execution?
2. What happens if one Promise in the chain rejects?
3. How is this better than the callback approach?

---

## Exercise 3: async/await - Readable Async Code

### Objective
Convert Promise chains to async/await syntax for improved readability.

### Task
Refactor the previous exercise to use async/await instead of `.then()` chains.

### Starter Code

```javascript
const https = require('https');

function fetchData(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// TODO: Create an async function that fetches all three resources
async function fetchAllData() {
  // TODO: Use await to fetch each URL
  // const user = await fetchData('...');
  
}

// TODO: Call the async function
// Don't forget error handling!
```

### Hint
- Use `try/catch` blocks for error handling with async/await
- The code reads like synchronous code but is still non-blocking
- Remember to call your async function!

### Hidden Pitfall Exercise

```javascript
// Anti-pattern: await in a loop
async function processItemsSlowly(items) {
  const results = [];
  
  for (const item of items) {
    const result = await fetchData(item); // Processes one at a time!
    results.push(result);
  }
  
  return results;
}

// TODO: Identify why this is problematic
// TODO: How would you fix it if the order doesn't matter?
```

---

## Exercise 4: Parallelism Patterns

### Objective
Understand the difference between sequential and parallel execution.

### Task Part A: Sequential vs Parallel Timing

```javascript
const delay = (ms, value) => new Promise(resolve => setTimeout(() => resolve(value), ms));

// Sequential execution
async function sequential() {
  console.time('Sequential');
  
  const result1 = await delay(1000, 'First');
  const result2 = await delay(1000, 'Second');
  const result3 = await delay(1000, 'Third');
  
  console.timeEnd('Sequential');
  console.log([result1, result2, result3]);
}

// TODO: Implement parallel execution using Promise.all()
async function parallel() {
  console.time('Parallel');
  
  // TODO: Execute all three delays in parallel
  // Hint: Promise.all([...])
  
  console.timeEnd('Parallel');
}

// Run both and compare timing
sequential();
parallel();
```

### Task Part B: Promise.all() for Multiple API Calls

```javascript
// TODO: Fetch all three resources in parallel
async function fetchAllInParallel() {
  const urls = [
    'https://jsonplaceholder.typicode.com/users/1',
    'https://jsonplaceholder.typicode.com/posts/1',
    'https://jsonplaceholder.typicode.com/comments/1'
  ];
  
  // TODO: Use Promise.all() to fetch all URLs simultaneously
  // const results = await Promise.all(...);
}
```

### Task Part C: Promise.allSettled() for Resilient Execution

```javascript
// TODO: Fetch multiple resources, some of which might fail
async function fetchWithResilience() {
  const urls = [
    'https://jsonplaceholder.typicode.com/users/1',
    'https://jsonplaceholder.typicode.com/invalid-endpoint',  // This will fail!
    'https://jsonplaceholder.typicode.com/posts/1'
  ];
  
  // TODO: Use Promise.allSettled() instead of Promise.all()
  // This way, one failure won't stop the others
  
  // TODO: Process results, checking status of each
  // results.forEach(result => {
  //   if (result.status === 'fulfilled') { ... }
  //   else { ... }
  // });
}
```

### Questions to Consider
1. What's the time difference between sequential and parallel execution?
2. When would you use `Promise.all()` vs `Promise.allSettled()`?
3. What happens if one Promise rejects in `Promise.all()`?

---

## Exercise 5: Error Handling

### Objective
Master error handling patterns in asynchronous code.

### Task Part A: Try/Catch with Async Functions

```javascript
// TODO: Implement proper error handling
async function fetchWithErrorHandling(url) {
  try {
    // TODO: Attempt to fetch data
    // TODO: Handle successful response
  } catch (error) {
    // TODO: Handle errors appropriately
    // What information should you log?
    // Should you re-throw or return a default value?
  }
}
```

### Task Part B: Error Propagation

```javascript
// Lower-level function
async function readUserData(userId) {
  if (!userId) {
    throw new Error('User ID is required');
  }
  
  // Simulate API call
  const response = await fetchData(`https://jsonplaceholder.typicode.com/users/${userId}`);
  return response;
}

// Mid-level function
async function processUser(userId) {
  // TODO: Should you catch errors here or let them propagate?
  const user = await readUserData(userId);
  return user.name.toUpperCase();
}

// Top-level function
async function displayUser(userId) {
  // TODO: Implement error handling at the appropriate level
  // Where should the final catch be?
}

// Test with valid and invalid inputs
displayUser(1);    // Should work
displayUser(null); // Should handle error gracefully
```

### Task Part C: Sync vs Async Errors

```javascript
// Synchronous error - thrown immediately
function syncError() {
  throw new Error('Sync error');
}

// Asynchronous error - rejected Promise
async function asyncError() {
  throw new Error('Async error');
}

// TODO: Demonstrate the difference
// Try calling each function and handling errors

// Synchronous:
try {
  syncError();
} catch (err) {
  console.error('Caught sync error:', err.message);
}

// Asynchronous:
// TODO: How do you properly catch this?
asyncError(); // What happens if you don't await or .catch()?
```

### Task Part D: Centralized Error Handler

```javascript
// TODO: Create a centralized error handling middleware
class AsyncError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

// Centralized error handler
function errorHandler(error) {
  console.error('=== Error Caught ===');
  console.error('Message:', error.message);
  console.error('Stack:', error.stack);
  
  if (error instanceof AsyncError) {
    console.error('Status Code:', error.statusCode);
    // TODO: Handle operational errors (expected errors)
  } else {
    // TODO: Handle programmer errors (bugs)
    console.error('Unexpected error!');
  }
}

// TODO: Implement functions that throw different types of errors
async function operationThatMightFail(shouldFail) {
  if (shouldFail) {
    throw new AsyncError('Expected operation failure', 404);
  }
  return 'Success!';
}

// TODO: Use the error handler to catch and process errors
async function main() {
  try {
    await operationThatMightFail(true);
  } catch (error) {
    errorHandler(error);
  }
}
```

### Best Practices Checklist
- [ ] Always handle Promise rejections (avoid unhandled rejection warnings)
- [ ] Use try/catch blocks with async/await
- [ ] Decide at which level to handle errors (propagate vs handle immediately)
- [ ] Distinguish between operational errors and programmer errors
- [ ] Log sufficient context for debugging
- [ ] Return meaningful error messages to users

---

## Bonus Challenge: Complete Application

### Objective
Build a complete application combining all concepts.

### Task
Create a script that:

1. Reads a list of user IDs from a file (`users.json`)
2. Fetches user data for each ID in parallel from an API
3. For each user, fetches their posts
4. Saves all results to an output file
5. Implements comprehensive error handling
6. Reports success/failure statistics

### Requirements
- Use async/await syntax
- Implement parallel fetching where appropriate
- Use Promise.allSettled() to handle partial failures
- Implement centralized error handling
- Add proper logging

### Starter Code

```javascript
const fs = require('fs').promises;
const https = require('https');

// Helper function
function fetchData(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

// TODO: Implement the complete solution
async function processAllUsers() {
  // 1. Read user IDs from file
  // 2. Fetch all users in parallel
  // 3. For each user, fetch their posts
  // 4. Save results
  // 5. Report statistics
}

// Sample users.json content:
// [1, 2, 3, 4, 5]
```

---

## Learning Outcomes

After completing this lab, you should be able to:

- ✅ Identify and avoid callback hell
- ✅ Work with Promises using `.then()` and `.catch()`
- ✅ Convert Promise chains to async/await syntax
- ✅ Understand when to use sequential vs parallel execution
- ✅ Use `Promise.all()` and `Promise.allSettled()` appropriately
- ✅ Implement proper error handling in async code
- ✅ Distinguish between sync and async errors
- ✅ Implement centralized error handling patterns

## Additional Resources

- [MDN Web Docs - Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [MDN Web Docs - async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- [Node.js - Error Handling](https://nodejs.org/en/docs/guides/error-handling/)
