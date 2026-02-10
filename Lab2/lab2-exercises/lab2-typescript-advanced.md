# Lab 2: Advanced TypeScript

## Overview
This lab covers advanced TypeScript features including decorators, mapped types, conditional types, utility types, and advanced patterns for building robust, maintainable applications.

---

## Prerequisites

- Completed Lab 2 Basics
- Understanding of TypeScript fundamentals
- Node.js and TypeScript installed

## Setup

### Enable Experimental Features

Update your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

### Install Dependencies

```bash
npm install reflect-metadata
npm install --save-dev @types/node
```

---

## Exercise 1: Decorators - Class & Method Decorators

### Objective
Learn to create and use decorators to add metadata and modify class behavior.

### Task
Build a logging and validation system using decorators.

### Starter Code

```typescript
// TODO: Create a class decorator that logs when a class is instantiated
function Loggable(constructor: Function) {
  // TODO: Add logging logic
  // Hint: Wrap the constructor to intercept instantiation
}

// TODO: Create a method decorator that logs method calls
function Log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  // TODO: Save original method
  const originalMethod = descriptor.value;
  
  // TODO: Replace method with logging wrapper
  descriptor.value = function(...args: any[]) {
    console.log(`Calling ${propertyKey} with args:`, args);
    // TODO: Call original method
    // TODO: Log result
    // TODO: Return result
  };
  
  return descriptor;
}

// TODO: Create a method decorator that measures execution time
function Measure(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  // TODO: Implement performance measurement
  // Hint: Use console.time() and console.timeEnd()
}

// TODO: Apply decorators to this class
class Calculator {
  @Log
  add(a: number, b: number): number {
    return a + b;
  }
  
  @Log
  @Measure
  fibonacci(n: number): number {
    if (n <= 1) return n;
    return this.fibonacci(n - 1) + this.fibonacci(n - 2);
  }
}

// Test
const calc = new Calculator();
console.log(calc.add(5, 3));
console.log(calc.fibonacci(10));
```

### Hints
- Class decorator: `(constructor: Function) => void`
- Method decorator: `(target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor`
- Access original method: `descriptor.value`
- Decorators execute at class definition time, not instantiation

### Questions to Consider
1. In what order do multiple decorators execute?
2. How do decorators differ from higher-order functions?
3. What are the four types of decorators in TypeScript?

---

## Exercise 2: Property Decorators & Validation

### Objective
Create property decorators for validation and metadata.

### Task
Build a validation system using property decorators.

### Starter Code

```typescript
import 'reflect-metadata';

// Metadata key for storing validation rules
const validationMetadataKey = Symbol('validation');

// TODO: Create a @Required decorator
function Required(target: any, propertyKey: string) {
  // TODO: Store metadata indicating this property is required
  let existingRules = Reflect.getMetadata(validationMetadataKey, target, propertyKey) || [];
  existingRules.push({ type: 'required' });
  Reflect.defineMetadata(validationMetadataKey, existingRules, target, propertyKey);
}

// TODO: Create a @MinLength decorator
function MinLength(length: number) {
  return function(target: any, propertyKey: string) {
    // TODO: Store min length validation rule
    let existingRules = Reflect.getMetadata(validationMetadataKey, target, propertyKey) || [];
    existingRules.push({ type: 'minLength', value: length });
    Reflect.defineMetadata(validationMetadataKey, existingRules, target, propertyKey);
  };
}

// TODO: Create a @Range decorator for numbers
function Range(min: number, max: number) {
  // TODO: Implement range validation decorator
}

// TODO: Create a @Email decorator
function Email(target: any, propertyKey: string) {
  // TODO: Add email validation rule
}

// TODO: Create a validate function that checks all decorators
function validate(obj: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // TODO: Get all properties of the object
  // TODO: For each property, get validation metadata
  // TODO: Apply each validation rule
  // TODO: Collect errors
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Test class
class User {
  @Required
  @MinLength(3)
  username: string;
  
  @Required
  @Email
  email: string;
  
  @Range(18, 100)
  age: number;
  
  constructor(username: string, email: string, age: number) {
    this.username = username;
    this.email = email;
    this.age = age;
  }
}

// Test validation
const user1 = new User('Al', 'invalid-email', 15);
const result = validate(user1);
console.log('Valid:', result.isValid);
console.log('Errors:', result.errors);

const user2 = new User('Alice', 'alice@example.com', 25);
const result2 = validate(user2);
console.log('Valid:', result2.isValid);
```

### Hints
- Property decorator: `(target: any, propertyKey: string) => void`
- Use `reflect-metadata` to store validation rules
- Decorator factories: return a decorator function from a function
- Access object properties: `Object.keys(obj)`

### Questions to Consider
1. Why do we need `reflect-metadata` for this pattern?
2. How would you add custom error messages?
3. Could you combine this with class-validator library?

---

## Exercise 3: Advanced Generics & Constraints

### Objective
Master generic constraints, conditional types, and type inference.

### Task
Create sophisticated type-safe utility functions.

### Starter Code

```typescript
// TODO: Create a generic function with constraint
// Should only accept objects with an 'id' property
function findById<T>(items: T[], id: number): T | undefined {
  // TODO: Add constraint: T extends { id: number }
  return items.find(item => item.id === id);
}

// TODO: Create a generic function that extracts property type
// Example: getProperty(user, 'name') should return string
function getProperty<T, K>(obj: T, key: K) {
  // TODO: Add constraints
  // K should extend keyof T
  // Return type should be T[K]
  return obj[key];
}

// TODO: Create a type-safe update function
function updateObject<T>(obj: T, updates: Partial<T>): T {
  // TODO: Implement merge logic
  return { ...obj, ...updates };
}

// TODO: Create a function that picks specific properties
// Result should only have the specified keys
function pick<T, K>(obj: T, keys: K[]) {
  // TODO: Add proper constraints and return type
  // Hint: K extends keyof T, return type Pick<T, K>
  const result: any = {};
  for (const key of keys) {
    result[key] = obj[key];
  }
  return result;
}

// TODO: Create a generic Repository class
class Repository<T> {
  private items: T[] = [];
  
  // TODO: Add constraint that T must have an id
  
  add(item: T): void {
    this.items.push(item);
  }
  
  // TODO: Implement findById using generic constraint
  findById(id: number): T | undefined {
    // TODO: This should only compile if T has an id property
  }
  
  // TODO: Implement update method
  update(id: number, updates: Partial<T>): boolean {
    // TODO: Find and update item
  }
  
  // TODO: Implement findWhere method with generic predicate
  findWhere(predicate: (item: T) => boolean): T[] {
    return this.items.filter(predicate);
  }
}

// Test
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

const repo = new Repository<Product>();
repo.add({ id: 1, name: 'Laptop', price: 999, category: 'Electronics' });
repo.add({ id: 2, name: 'Mouse', price: 25, category: 'Electronics' });

const laptop = repo.findById(1);
console.log(laptop);

const electronics = repo.findWhere(p => p.category === 'Electronics');
console.log(electronics);
```

### Hints
- Generic constraint: `<T extends Type>`
- keyof operator: `K extends keyof T`
- Indexed access: `T[K]`
- Built-in utilities: `Partial<T>`, `Pick<T, K>`, `Omit<T, K>`

### Questions to Consider
1. What are generic constraints and why use them?
2. How does `keyof` help with type safety?
3. What's the difference between `extends` in constraints vs inheritance?

---

## Exercise 4: Mapped Types & Conditional Types

### Objective
Create custom utility types using mapped and conditional types.

### Task
Build advanced type transformations.

### Starter Code

```typescript
// TODO: Create a Readonly version of a type (recreate built-in Readonly)
type MyReadonly<T> = {
  // TODO: Map each property to readonly
};

// TODO: Create a Nullable type that makes all properties nullable
type Nullable<T> = {
  // TODO: Map each property to T[K] | null
};

// TODO: Create a type that extracts only function properties
type FunctionPropertyNames<T> = {
  // TODO: Use conditional type to filter function properties
  // Hint: [K in keyof T]: T[K] extends Function ? K : never
}[keyof T];

type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>;

// TODO: Create a DeepPartial type that makes nested properties optional
type DeepPartial<T> = {
  // TODO: Recursively make properties optional
  // Hint: use conditional type to check if property is an object
};

// TODO: Create a RequiredKeys type that extracts required property names
type RequiredKeys<T> = {
  // TODO: Filter keys where T[K] is not optional
}[keyof T];

// TODO: Create a type that flips string literal unions
// Example: "get" | "post" -> { get: "get", post: "post" }
type StringUnionToObject<T extends string> = {
  // TODO: Create mapped type from string union
};

// Test types
interface User {
  id: number;
  name: string;
  email?: string;
  save(): void;
  delete(): void;
}

// TODO: Test your mapped types
type ReadonlyUser = MyReadonly<User>;
type NullableUser = Nullable<User>;
type UserFunctions = FunctionProperties<User>;
type PartialUser = DeepPartial<User>;

// Example usage
function processUser(user: ReadonlyUser) {
  // user.name = "new"; // Should error - readonly
  console.log(user.name);
}

const nullableUser: NullableUser = {
  id: null,
  name: null,
  email: null,
  save: () => {},
  delete: () => {}
};
```

### Hints
- Mapped type: `{ [K in keyof T]: Type }`
- Conditional type: `T extends U ? X : Y`
- Index access: `T[keyof T]`
- Never type removes properties in mapped types
- Recursive types: type can reference itself

### Questions to Consider
1. How do mapped types differ from interfaces?
2. What happens with `never` in a union type?
3. How can you make deeply nested properties optional?

---

## Exercise 5: Template Literal Types

### Objective
Use template literal types for advanced string type manipulation.

### Task
Create type-safe event emitters and route handlers.

### Starter Code

```typescript
// TODO: Create type-safe event names
type EventName = 'user:created' | 'user:updated' | 'user:deleted' | 'order:placed';

// TODO: Extract event prefix ("user" from "user:created")
type ExtractPrefix<T extends string> = T extends `${infer Prefix}:${string}` ? Prefix : never;

// TODO: Extract event action ("created" from "user:created")
type ExtractAction<T extends string> = T extends `${string}:${infer Action}` ? Action : never;

// TODO: Create type for event payload based on event name
type EventPayload<T extends EventName> = 
  T extends 'user:created' ? { userId: number; username: string } :
  T extends 'user:updated' ? { userId: number; changes: Record<string, any> } :
  T extends 'user:deleted' ? { userId: number } :
  T extends 'order:placed' ? { orderId: number; amount: number } :
  never;

// TODO: Create type-safe EventEmitter
class EventEmitter {
  private listeners: Map<string, Function[]> = new Map();
  
  // TODO: Type the on method to only accept valid event names and typed callbacks
  on<T extends EventName>(event: T, callback: (payload: EventPayload<T>) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }
  
  // TODO: Type the emit method
  emit<T extends EventName>(event: T, payload: EventPayload<T>) {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(callback => callback(payload));
  }
}

// TODO: Create type-safe route builder
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type RoutePattern = `/${string}`;
type Route<M extends HttpMethod, P extends RoutePattern> = `${M} ${P}`;

// TODO: Extract method and path from route string
type ParseRoute<T extends string> = 
  T extends `${infer Method extends HttpMethod} ${infer Path extends RoutePattern}`
    ? { method: Method; path: Path }
    : never;

// TODO: Create typed route handler
type RouteHandler<T extends string> = (
  req: { method: ParseRoute<T>['method']; path: ParseRoute<T>['path']; body?: any },
  res: { send: (data: any) => void }
) => void;

class Router {
  private routes: Map<string, Function> = new Map();
  
  // TODO: Add route method with template literal type
  route<T extends string>(route: T, handler: RouteHandler<T>) {
    this.routes.set(route, handler);
  }
}

// Test EventEmitter
const emitter = new EventEmitter();

emitter.on('user:created', (payload) => {
  // payload is typed as { userId: number; username: string }
  console.log(`User created: ${payload.username}`);
});

emitter.emit('user:created', { userId: 1, username: 'Alice' });
// emitter.emit('user:created', { wrong: 'payload' }); // Should error

// Test Router
const router = new Router();

router.route('GET /users', (req, res) => {
  // req.method is typed as 'GET'
  // req.path is typed as '/users'
  res.send({ users: [] });
});
```

### Hints
- Template literal type: `` type T = `${string}` ``
- Type inference with `infer`: `` T extends `${infer X}` ? X : never ``
- Combine with conditional types for parsing
- Use in generic constraints for precise typing

### Questions to Consider
1. How do template literal types improve API design?
2. What are the limitations of string manipulation at type level?
3. How can this help prevent runtime errors?

---

## Exercise 6: Advanced Patterns - Builder & Factory

### Objective
Implement design patterns with full type safety.

### Task
Create type-safe builder and factory patterns.

### Starter Code

```typescript
// TODO: Create a type-safe builder pattern for complex objects

interface HttpRequest {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

// TODO: Create a builder that enforces required properties
class RequestBuilder {
  private request: Partial<HttpRequest> = {};
  
  // TODO: Type methods to track which properties have been set
  // Hint: Use method chaining with different return types
  
  url(url: string): this {
    this.request.url = url;
    return this;
  }
  
  method(method: HttpRequest['method']): this {
    this.request.method = method;
    return this;
  }
  
  headers(headers: Record<string, string>): this {
    this.request.headers = headers;
    return this;
  }
  
  body(body: any): this {
    this.request.body = body;
    return this;
  }
  
  timeout(ms: number): this {
    this.request.timeout = ms;
    return this;
  }
  
  // TODO: Build should only work if required properties are set
  // This is tricky - research "phantom types" or "branded types"
  build(): HttpRequest {
    if (!this.request.url || !this.request.method) {
      throw new Error('URL and method are required');
    }
    return this.request as HttpRequest;
  }
}

// TODO: Create a type-safe factory pattern
interface Product {
  id: number;
  name: string;
  price: number;
}

interface Service {
  id: number;
  name: string;
  hourlyRate: number;
}

// TODO: Create a generic Factory
abstract class Factory<T> {
  private idCounter = 1;
  
  // TODO: Create method should be implemented by subclasses
  abstract create(data: Omit<T, 'id'>): T;
  
  protected generateId(): number {
    return this.idCounter++;
  }
}

// TODO: Implement concrete factories
class ProductFactory extends Factory<Product> {
  create(data: Omit<Product, 'id'>): Product {
    return {
      id: this.generateId(),
      ...data
    };
  }
}

class ServiceFactory extends Factory<Service> {
  // TODO: Implement
}

// TODO: Create a factory registry with type safety
class FactoryRegistry {
  private factories = new Map<string, Factory<any>>();
  
  // TODO: Register factory with type parameter
  register<T>(name: string, factory: Factory<T>) {
    this.factories.set(name, factory);
  }
  
  // TODO: Get factory with return type inference
  get<T>(name: string): Factory<T> | undefined {
    return this.factories.get(name);
  }
}

// Test Builder
const request = new RequestBuilder()
  .url('https://api.example.com')
  .method('POST')
  .headers({ 'Content-Type': 'application/json' })
  .body({ data: 'test' })
  .build();

console.log(request);

// Test Factory
const productFactory = new ProductFactory();
const product = productFactory.create({ name: 'Laptop', price: 999 });
console.log(product);

const registry = new FactoryRegistry();
registry.register('product', productFactory);
const retrievedFactory = registry.get<Product>('product');
```

### Hints
- Use method chaining with `return this`
- Abstract classes for factory base
- Generic factory with constraints
- Consider using branded types for compile-time validation

### Questions to Consider
1. How does the builder pattern improve API usability?
2. What are the benefits of the factory pattern with TypeScript?
3. How can you enforce required properties at compile time?

---

## Exercise 7: Type-Safe State Machine

### Objective
Build a type-safe finite state machine.

### Task
Create a state machine that prevents invalid state transitions at compile time.

### Starter Code

```typescript
// TODO: Define states and transitions
type State = 'idle' | 'loading' | 'success' | 'error';

// TODO: Define valid transitions
type Transitions = {
  idle: 'loading';
  loading: 'success' | 'error';
  success: 'idle';
  error: 'idle';
};

// TODO: Create a state machine class
class StateMachine<States extends string, T extends Record<States, any>> {
  private currentState: States;
  private transitions: T;
  
  constructor(initialState: States, transitions: T) {
    this.currentState = initialState;
    this.transitions = transitions;
  }
  
  // TODO: Transition method should only accept valid next states
  transition<S extends States>(
    from: S,
    to: T[S] extends string ? T[S] : never
  ): void {
    if (this.currentState !== from) {
      throw new Error(`Invalid transition: not in ${from} state`);
    }
    
    // TODO: Validate transition is allowed
    const allowedTransitions = this.transitions[from];
    
    this.currentState = to as States;
  }
  
  getState(): States {
    return this.currentState;
  }
}

// TODO: Create typed transition helper
type TransitionFn<S extends string, T extends Record<S, any>> = {
  [K in S]: (to: T[K]) => void;
};

// TODO: Create a more ergonomic state machine
class TypedStateMachine<S extends string, T extends Record<S, S>> {
  private state: S;
  
  constructor(initial: S) {
    this.state = initial;
  }
  
  // TODO: Can transition method with type checking
  canTransition(to: S): boolean {
    // Check if transition is valid
    return true; // TODO: Implement
  }
  
  // TODO: Transition with type safety
  transition(to: S): void {
    if (!this.canTransition(to)) {
      throw new Error(`Cannot transition from ${this.state} to ${to}`);
    }
    this.state = to;
  }
  
  getState(): S {
    return this.state;
  }
  
  // TODO: Add state listeners
  onEnter(state: S, callback: () => void): void {
    // Implementation
  }
}

// Test
const machine = new TypedStateMachine<State, Transitions>('idle');
machine.transition('loading'); // OK
machine.transition('success'); // OK
// machine.transition('error'); // Should error - not allowed from success
```

### Hints
- Use mapped types for state transitions
- Conditional types to validate transitions
- Consider using discriminated unions for state data
- Add event listeners for state changes

### Questions to Consider
1. How do type-safe state machines prevent bugs?
2. What real-world use cases benefit from this pattern?
3. How would you add state-specific data/context?

---

## Bonus Challenge: ORM-like Type System

### Objective
Create an ORM-like API with full type inference.

### Task
Build a query builder that infers types from the schema.

### Starter Code

```typescript
// TODO: Define schema structure
interface Schema {
  [tableName: string]: {
    [columnName: string]: 'string' | 'number' | 'boolean' | 'date';
  };
}

// TODO: Convert schema type to TypeScript types
type InferType<T> = 
  T extends 'string' ? string :
  T extends 'number' ? number :
  T extends 'boolean' ? boolean :
  T extends 'date' ? Date :
  never;

type TableRow<T extends Record<string, any>> = {
  [K in keyof T]: InferType<T[K]>;
};

// TODO: Create query builder
class QueryBuilder<S extends Schema, T extends keyof S> {
  constructor(private schema: S, private table: T) {}
  
  // TODO: Select method with column inference
  select<K extends keyof S[T]>(...columns: K[]): Pick<TableRow<S[T]>, K>[] {
    // Mock implementation
    return [];
  }
  
  // TODO: Where method with type-safe conditions
  where<K extends keyof S[T]>(
    column: K,
    operator: '=' | '>' | '<' | '!=',
    value: InferType<S[T][K]>
  ): this {
    // Mock implementation
    return this;
  }
  
  // TODO: Insert method with type checking
  insert(data: TableRow<S[T]>): this {
    // Mock implementation
    return this;
  }
  
  // TODO: Update method
  update(data: Partial<TableRow<S[T]>>): this {
    // Mock implementation
    return this;
  }
}

// TODO: Create database class
class Database<S extends Schema> {
  constructor(private schema: S) {}
  
  table<T extends keyof S>(name: T): QueryBuilder<S, T> {
    return new QueryBuilder(this.schema, name);
  }
}

// Test
const schema = {
  users: {
    id: 'number' as const,
    name: 'string' as const,
    email: 'string' as const,
    age: 'number' as const,
    isActive: 'boolean' as const
  },
  posts: {
    id: 'number' as const,
    userId: 'number' as const,
    title: 'string' as const,
    content: 'string' as const,
    createdAt: 'date' as const
  }
} as const;

const db = new Database(schema);

// Should have full type inference
const users = db.table('users')
  .select('id', 'name', 'email')
  .where('age', '>', 18)
  .where('isActive', '=', true);

// Insert should require all fields
db.table('users').insert({
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
  age: 25,
  isActive: true
});

// Update should accept partial
db.table('users').update({
  name: 'Alice Smith'
});
```

### Requirements
- Full type inference from schema
- Type-safe query methods
- Prevent invalid column names
- Enforce correct value types
- Support relationships (bonus)

---

## Learning Outcomes

After completing this lab, you should be able to:

- ✅ Create and apply decorators to classes, methods, and properties
- ✅ Build validation systems with metadata reflection
- ✅ Use advanced generic constraints and type inference
- ✅ Create custom utility types with mapped and conditional types
- ✅ Leverage template literal types for string manipulation
- ✅ Implement design patterns with full type safety
- ✅ Build type-safe DSLs (Domain Specific Languages)
- ✅ Create complex type systems with advanced features

## Advanced Patterns Summary

| Pattern | Use Case | Key Features |
|---------|----------|--------------|
| Decorators | Metadata, AOP | `@decorator` syntax |
| Mapped Types | Type transformations | `{ [K in keyof T]: ... }` |
| Conditional Types | Type logic | `T extends U ? X : Y` |
| Template Literals | String typing | `` `${string}` `` |
| Phantom Types | Compile-time validation | Branded types |
| Builder Pattern | Complex construction | Method chaining |
| State Machine | State management | Type-safe transitions |

## Best Practices

- [ ] Use decorators for cross-cutting concerns (logging, validation)
- [ ] Prefer mapped types over manual type definitions
- [ ] Leverage conditional types for type-level logic
- [ ] Use template literals for DSLs and type-safe strings
- [ ] Apply design patterns to enforce invariants at compile time
- [ ] Document complex types with JSDoc comments
- [ ] Test types with type assertions or `tsd` library

## Common Pitfalls

⚠️ **Over-engineering types** - Keep types understandable
⚠️ **Decorator execution order** - Remember they execute bottom-up
⚠️ **Circular type references** - Can cause compiler issues
⚠️ **Too complex conditional types** - Hard to maintain
⚠️ **Runtime vs compile-time** - Types don't exist at runtime

## Additional Resources

- [TypeScript Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html)
- [Advanced Types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)
- [Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)
- [Type Challenges](https://github.com/type-challenges/type-challenges)
- [ts-toolbelt](https://github.com/millsp/ts-toolbelt) - Advanced utility types library
