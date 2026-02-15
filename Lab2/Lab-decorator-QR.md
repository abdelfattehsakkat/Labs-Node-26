# 🧪 Lab — Introduction aux Decorators en TypeScript (Logging) — VERSION PROF

---


## 🔹 Étape 0 — Le problème

### 🧠 Théorie


**❓ Questions :**
- Quel est le problème avec cette approche ?
- Que se passera-t-il si on a 10 méthodes dans cette classe ?

**✅ Réponses :**
- ❌ **Problème** : le logging pollue la logique métier. On va répéter ce code dans chaque méthode.
- 👉 **Objectif** : séparer le logging du code métier.

---

## 🔹 Étape 1 — Comprendre le wrapping (sans decorator)


**❓ Questions :**
- Qu'avons-nous fait à la fonction `add` ?
- Quel est le lien entre cette approche et les decorators ?

**✅ Réponses :**
- On a "emballé" la fonction.
- 👉 Un decorator fait exactement la même chose, mais automatiquement sur une méthode de classe.

---

## 🔹 Étape 2 — Premier decorator minimal


**❓ Questions :**
- À quel moment le decorator s'exécute-t-il ?
- Est-ce à la définition de la classe ou à l'instanciation ?

**✅ Réponses :**
- Important :
  - Il s'exécute à la **définition** de la classe
  - Pas à l'instanciation


**❓ Questions :**
- Dans quel ordre voyez-vous les messages dans la console ?
- Que pouvez-vous conclure sur le moment d'exécution du decorator ?

**✅ Réponses :**
- Le message du decorator s'affiche **avant** toute instanciation.
- 👉 **Conclusion** : le decorator s'exécute quand la classe est définie.

---

## 🔹 Étape 3 — Modifier réellement la méthode

**❓ Questions :**
- Pourquoi sauvegarde-t-on la méthode originale ?
- Quel est le rôle de `apply(this, args)` ?
- Que se passe-t-il si on oublie de retourner `result` ?

**✅ Réponses :**
- On sauvegarde la méthode originale pour pouvoir l'appeler depuis le wrapper.
- On la remplace par un wrapper.
- On utilise `apply(this, args)` pour conserver le bon contexte (`this`) et passer tous les arguments.
- Si on oublie `return result`, la méthode retournera `undefined` au lieu de la vraie valeur.
ator factory :



**❓ Questions :**
- Quelle est la différence entre un decorator et une decorator factory ?
- Que se passe-t-il pour la méthode `multiply` ?

**✅ Réponses :**
- Un **decorator** est directement une fonction qui prend `(target, propertyKey, descriptor)`.
- Une **decorator factory** est une fonction qui retourne un decorator. Elle permet de passer des paramètres.
- Pour `multiply`, le logging est désactivé (`enabled = false`), donc aucun log n'apparaît.

