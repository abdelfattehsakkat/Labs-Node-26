export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

// In-memory data store
export class UserStore {
  private users: User[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      createdAt: new Date('2024-01-15')
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      createdAt: new Date('2024-02-20')
    }
  ];

  private nextId = 3;

  getAll(): User[] {
    return this.users;
  }

  getById(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }

  create(name: string, email: string): User {
    const newUser: User = {
      id: this.nextId++,
      name,
      email,
      createdAt: new Date()
    };
    this.users.push(newUser);
    return newUser;
  }

  update(id: number, name: string, email: string): User | undefined {
    const user = this.users.find(u => u.id === id);
    if (user) {
      user.name = name;
      user.email = email;
    }
    return user;
  }

  delete(id: number): boolean {
    const index = this.users.findIndex(u => u.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
      return true;
    }
    return false;
  }
}
