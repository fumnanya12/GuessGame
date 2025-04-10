# Assembly: Endgame

## Overview
This file defines the main interactive component of the game Assembly: Endgame, a word-guessing game inspired by Hangman. The player must guess the correct programming term before "losing" all the available programming languages, metaphorically ending in "Assembly".

## Core Features & Logic
* Displays a random word for the user to guess.
* Tracks correct and incorrect guesses.

* Visualizes lost programming languages as incorrect attempts.

* Uses color-coded buttons and animated messages to enhance game feel.

* Ends with a victory or defeat message.

* Provides screen reader announcements for accessibility.

* Includes a confetti effect upon winning.
## 📂 File: `App.jsx`

### 📦 Imports

```js
import { useState } from 'react';
import { clsx } from 'clsx';
import { languages } from './languages';
import { getFarewellText, getRandomWord } from './utils';
import Confetti from "react-confetti";
```
## ♿ Accessibility Notes
* Uses `aria-live`="polite" and `role`="status" for screen reader feedback.

* Announces each guess and the current state of the word.