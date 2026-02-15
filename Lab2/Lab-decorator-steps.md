# 🧪 Lab — Introduction aux Decorators en TypeScript (Logging)

---

## 🎯 Objectifs

À la fin de ce lab, vous serez capable de :

- Comprendre ce qu'est un decorator
- Savoir quand il s'exécute
- Modifier une méthode avec un decorator
- Créer un decorator paramétrable
- Comprendre l'intérêt des comportements transversaux (logging)

---

## 🔹 Étape 0 — Le problème

### 🧠 Théorie

On veut logger les appels de méthodes.

Exemple classique :

```ts
class Calculator {
  add(a: number, b: number) {
    console.log("Calling add with:", a, b);
    const result = a + b;
    console.log("Result:", result);
    return result;
  }
}
```

**❓ Questions :**
- Quel est le problème avec cette approche ?
- Que se passera-t-il si on a 10 méthodes dans cette classe ?

---

## 🔹 Étape 1 — Comprendre le wrapping (sans decorator)

### 🧠 Théorie

Un decorator est essentiellement un wrapper automatique.

Avant d'utiliser `@`, comprenons le principe.

### 💻 Code

```ts
function withLogging(fn: Function) {
  return function (...args: any[]) {
    console.log("Calling with args:", args);
    const result = fn(...args);
    console.log("Result:", result);
    return result;
  };
}

function add(a: number, b: number) {
  return a + b;
}

const loggedAdd = withLogging(add);

console.log(loggedAdd(2, 3));
```

### 🔍 Observation

**❓ Questions :**
- Qu'avons-nous fait à la fonction `add` ?
- Quel est le lien entre cette approche et les decorators ?

---

## 🔹 Étape 2 — Premier decorator minimal

### 🧠 Théorie

Un method decorator reçoit :

```ts
(target, propertyKey, descriptor)
```

**❓ Questions :**
- À quel moment le decorator s'exécute-t-il ?
- Est-ce à la définition de la classe ou à l'instanciation ?

### ⚙️ Préparation

Dans `tsconfig.json` :

```json
{
  "experimentalDecorators": true
}
```

### 💻 Code

```ts
function LogMethod(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  console.log("Decorator applied to:", propertyKey);
}
```

Test :

```ts
class Test {
  @LogMethod
  sayHello() {
    console.log("Hello");
  }
}

const t = new Test();
t.sayHello();
```

### 🔍 Observation

**❓ Questions :**
- Dans quel ordre voyez-vous les messages dans la console ?
- Que pouvez-vous conclure sur le moment d'exécution du decorator ?

---

## 🔹 Étape 3 — Modifier réellement la méthode

### 🧠 Théorie

La méthode réelle est stockée dans :

```ts
descriptor.value
```

On peut la remplacer par une autre fonction.

### 💻 Code

```ts
function LogMethod(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    console.log(`Calling ${propertyKey} with:`, args);

    const result = originalMethod.apply(this, args);

    console.log(`Result of ${propertyKey}:`, result);

    return result;
  };

  return descriptor;
}
```

Test :

```ts
class Calculator {
  @LogMethod
  add(a: number, b: number) {
    return a + b;
  }
}

const calc = new Calculator();
console.log(calc.add(5, 3));
```

### 🔍 Points importants

**❓ Questions :**
- Pourquoi sauvegarde-t-on la méthode originale ?
- Quel est le rôle de `apply(this, args)` ?
- Que se passe-t-il si on oublie de retourner `result` ?

---

## 🔹 Étape 4 — Rendre le decorator configurable

### 🧠 Théorie

On peut créer un decorator paramétrable. C'est une decorator factory :

```ts
function Decorator(param) {
  return function (target, propertyKey, descriptor) {
    ...
  };
}
```

### 💻 Code

```ts
function Log(enabled: boolean) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    if (!enabled) return descriptor;

    const original = descriptor.value;

    descriptor.value = function (...args: any[]) {
      console.log(`[LOG] ${propertyKey} called with`, args);
      const result = original.apply(this, args);
      console.log(`[LOG] ${propertyKey} returned`, result);
      return result;
    };

    return descriptor;
  };
}
```

Test :

```ts
class Calculator {
  @Log(true)
  add(a: number, b: number) {
    return a + b;
  }

  @Log(false)
  multiply(a: number, b: number) {
    return a * b;
  }
}

const calc = new Calculator();
calc.add(2, 3);
calc.multiply(2, 3);
```

**❓ Questions :**
- Quelle est la différence entre un decorator et une decorator factory ?
- Que se passe-t-il pour la méthode `multiply` ?

---

## 🎯 Résumé final

À la fin de ce lab, vous devez comprendre :

- Un decorator est une fonction
- Il s'exécute à la définition de la classe
- Il peut modifier une méthode via `descriptor.value`
- Il peut être paramétré
- Il est utile pour les comportements transversaux (logging, validation, sécurité…)

---

## 🧠 Questions de réflexion

- Pourquoi utilise-t-on `apply(this, args)` ?
- Que se passe-t-il si on oublie `return result` ?
- Pourquoi dit-on que le logging est un "cross-cutting concern" ?
