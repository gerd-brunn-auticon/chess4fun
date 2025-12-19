# Chess4fun - Projekt-Dokumentation

Diese Dokumentation beschreibt die Architektur, die verwendeten Technologien und gibt eine Anleitung für Installation, Deployment und GitHub-Upload für Einsteiger.

## 1. Projektübersicht & Spezifikation

**Ziel:** Entwicklung einer webbasierten 3D-Schachanwendung ("Chess4fun") mit minimalistischem Design und einem integrierten KI-Gegner.

### Umgesetzte Features (Spezifikation)

* **Spielmodi:**
  * Mensch vs. Mensch (Hotseat)
  * Mensch vs. KI (Stockfish Engine, Level 10)
  * Wahl der Farbe (Weiß oder Schwarz) mit automatischem Brett-Drehen
* **3D-Grafik:**
  * Interaktives 3D-Schachbrett (drehbar & zoombar)
  * High-End Materialien (Holz-Optik für Figuren und Brett)
  * Geometrische, minimalistische Figuren im "Bauhaus"-Stil
  * Visuelles Feedback: Zugvorschläge, letzter Zug, Schach-Warnung
* **Spiellogik:**
  * Vollständige Schachregeln (inkl. Rochade, En Passant, Bauernumwandlung)
  * Erkennung von Schachmatt, Remis und Patt
* **UI & Sound:**
  * Modernes Overlay mit Spielstatus, Timer und Zughistorie
  * Soundeffekte bei Zügen, Schlagen und Schach (prozedural generiert)
  * Responsive Anpassung an Browser-Fenster

---

## 2. Technologie-Stack

Dieses Projekt verwendet moderne Web-Technologien:

* **Laufzeitumgebung:** [Node.js](https://nodejs.org/) (zum Ausführen der Entwicklungstools)
* **Sprache:** JavaScript (React JSX) & CSS3
* **Framework:** [React](https://react.dev/) (für die Benutzeroberfläche und Logik-Struktur)
* **Build-Tool:** [Vite](https://vitejs.dev/) (für extrem schnellen Start und optimierte Builds)
* **3D-Engine:**
  * [Three.js](https://threejs.org/) (Basis 3D-Bibliothek)
  * [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) (Verbindet React mit Three.js)
  * [Drei](https://github.com/pmndrs/drei) (Hilfsbibliothek für fertige 3D-Komponenten)
* **Schach-Logik:** `chess.js` (validiert Züge und kennt die Regeln)
* **Künstliche Intelligenz:** Stockfish 17 (als WebAssembly/JavaScript im Browser laufend)

---

## 3. Architektur des Projekts

Der Code ist modular aufgebaut. Hier ist die Struktur für Einsteiger erklärt:

### Ordnerstruktur (`/src`)

* **`main.jsx`**: Der Startpunkt. Hier wird die React-App in die HTML-Seite "eingehängt".
* **`App.jsx`**: Die Hauptkomponente. Sie enthält die 3D-Leinwand (`Canvas`) und das UI-Overlay.
* **`/game`**: Enthält alles, was mit dem Schachspiel zu tun hat.
  * **`GameStateProvider.jsx`**: Das "Gehirn" der App.
    * Verwaltet den Zustand (Wer ist am Zug? Wie steht das Brett?).
    * Kommuniziert mit der Stockfish-KI (Web Worker).
    * Erzeugt Sounds.
  * **`GameScene.jsx`**: Die 3D-Welt. Platziert Licht, Kamera, Brett und Figuren.
  * **`Board.jsx`**: Zeichnet das Brett (64 Felder) und berechnet Klick-Positionen.
  * **`Piece.jsx`**: Zeichnet eine einzelne Schachfigur in 3D.
* **`/components`**: 2D-Benutzeroberfläche.
  * **`UIOverlay.jsx`**: Das Menü über dem Spiel (Startscreen, Timer, Historie).

### Datenfluss

1. Der Nutzer klickt auf ein Feld im 3D-Raum (`Board.jsx`).
2. Der Klick wird an den `GameStateProvider` gemeldet.
3. `chess.js` prüft, ob der Zug gültig ist.
4. Wenn ja: Der Zustand ändert sich → React zeichnet das Brett neu.
5. Wenn KI am Zug ist: `GameStateProvider` sendet den neuen Zustand an den Stockfish-Worker (Hintergrundprozess) und wartet auf die Antwort.

---

## 4. Installation & Start (Lokal)

Um das Spiel auf deinem Computer weiterzuentwickeln:

1. **Terminal öffnen:** (z.B. in VS Code "Terminal" -> "New Terminal").
2. **Abhängigkeiten installieren:**

    ```bash
    npm install
    ```

    *(Dies lädt alle Bibliotheken herunter, die in `package.json` stehen).*
3. **Entwicklungs-Server starten:**

    ```bash
    npm run dev
    ```

4. **Im Browser spielen:** Öffne die angezeigte Adresse (meist `http://localhost:5173`).

---

## 5. Deployment (Veröffentlichung im Internet)

Um das Spiel Freunden zu zeigen, musst du es "hosten". Die einfachste kostenlose Methode ist **Netlify**.

### Methode: Drag & Drop (Empfohlen)

1. **Build erstellen:**
    Führe im Terminal folgenden Befehl aus:

    ```bash
    npm run build
    ```

    Das erstellt einen neuen Ordner namens **`dist`**. Dieser Ordner enthält dein fertiges, optimiertes Spiel.
    *(Ignoriere Warnungen über "chunk size" – das ist bei 3D-Apps normal).*

2. **Upload:**
    * Gehe auf [https://app.netlify.com/drop](https://app.netlify.com/drop).
    * Ziehe den gesamten **`dist`** Ordner per Maus in das Upload-Feld.
    * Fertig! Netlify gibt dir sofort einen Link (z.B. `https://random-name.netlify.app`), den du teilen kannst.

---

## 6. Upload zu GitHub (Code sichern)

GitHub ist eine Plattform, um deinen Code zu speichern und zu teilen.

**Voraussetzung:** Du hast einen Account auf [github.com](https://github.com/) und Git installiert.

### Schritt-für-Schritt Anleitung

1. **Repository erstellen:**
    * Gehe auf GitHub oben rechts auf das **+** -> **New repository**.
    * Name: `chess4fun`.
    * Wähle "Public" (öffentlich) oder "Private".
    * Klicke **Create repository**.

2. **Code hochladen (im VS Code Terminal):**

    Initialisiere Git (falls noch nicht geschehen):

    ```bash
    git init
    ```

    Füge alle Dateien hinzu:

    ```bash
    git add .
    ```

    Speichere den aktuellen Stand ("Commit"):

    ```bash
    git commit -m "Erste Version von Chess4fun"
    ```

    Verbinde deinen PC mit GitHub (kopiere die URL von deinem neuen GitHub-Repo):

    ```bash
    git remote add origin https://github.com/DEIN_BENUTZERNAME/chess4fun.git
    ```

    Lade den Code hoch ("Push"):

    ```bash
    git branch -M main
    git push -u origin main
    ```

3. **Fertig!** Dein Code ist jetzt online gesichert.
