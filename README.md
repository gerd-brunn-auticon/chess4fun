# Chess4fun - 3D Web Chess

A modern, minimalist 3D chess application built with React, Three.js, and Stockfish AI.

## Prerequisites

Before running this project, you must have **Node.js** installed.
The error `npm : Die Benennung "npm" wurde nicht als Name... erkannt` indicates Node.js is missing or not in your system PATH.

1.  **Download Node.js:** [https://nodejs.org/](https://nodejs.org/) (Download the "LTS" version).
2.  **Install:** Run the installer. Ensure "Add to PATH" is checked during installation.
3.  **Restart:** After installation, restart your computer or your terminal (VS Code) to recognize the `npm` command.

## Setup Instructions

### 1. Install Dependencies
Open a terminal in this folder and run:
```bash
npm install
```

### 2. Setup AI (Stockfish)
To enable the AI opponent, you need to add the Stockfish engine files manually (since they were downloaded separately).

1.  Locate your downloaded **Stockfish zip** file.
2.  Extract the contents.
3.  Find the files **`stockfish.js`** and **`stockfish.wasm`** (if present).
4.  Copy these files into the **`public/`** folder of this project:
    *   `.../_Schach_3D/public/stockfish.js`
    *   `.../_Schach_3D/public/stockfish.wasm`

### 3. Run the Game
Start the development server:
```bash
npm run dev
```
Then open `http://localhost:5173` in your browser.

## Features
*   **3D Graphics:** Realistic board and pieces with drag-to-rotate camera.
*   **FIDE Rules:** Full support for moves, checkmate, castling, and promotions.
*   **Audio:** Synthesized sound effects.
*   **AI:** Play against Stockfish (requires correct setup of files in `public/`).
