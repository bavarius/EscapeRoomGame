# 🧩 Kids Escape Room Abenteuer

Ein interaktives, kinderfreundliches Solo-Escape-Room-Spiel für den Browser, entwickelt mit **TypeScript**, **Bootstrap 5 (SASS)** und dynamischen **JSON-Daten**.

---

## 🌟 Features

- **Kinderfreundliches Design:** Leuchtende Farben, kindgerechte Illustrationen und eine intuitive Benutzeroberfläche.
- **Verschiedene Abenteuer-Räume:**
  - 🌳 *Der verzauberte Zauberwald*
  - 🌊 *Unterwasser-Abenteuer*
  - 🚀 *Weltraum-Station*
  - 🐟 *Am See*
  - 👗 *Die Zauber-Boutique*
- **Verschiedene Schwierigkeitsgrade:** Wählbar zwischen *Leicht* (für Einsteiger) und *Schwer* (für Profis).
- **Flexible Rätsel-Typen:** Unterstützt Texteingaben, Zahlen-Rätsel und interaktive Karten-Sequenzen (`card_grid`).
- **Punkte- & Zeitsystem:**
  - Punkte sammeln für richtige Antworten (`+ max. 100 Pkt`). Die Punktzahl verringert sich mit der benötigten Zeit.
  - Punktabzug bei Fehlern (`-20 Pkt`) oder genutzten Hinweisen (`-50 Pkt`).
  - Ein spannender Countdown-Timer mit der Möglichkeit, sich mit Punkten zusätzliche Zeit zu erkaufen (`-100 Pkt` für `+30 Sek`).
- **Saubere Architektur:** Strikte Trennung von Spiel-Logik (Modelle/Controller) und DOM-Manipulation (UI-Renderer).
- **Konfigurationsbasiert:** Alle Räume und Rätsel sind extern in `rooms.json` gespeichert.

---

## 📁 Projektstruktur

```text
│   favicon.ico                  # Das Spiel-Icon
│   index.html                   # Hauptseite (HTML5 + Bootstrap CDN)
│   package-lock.json            # Projekt-Konfiguration
│   package.json                 # Projekt-Konfiguration & Skripte
│   README.md                    # Diese Datei
│   tsconfig.json                # TypeScript Compiler-Optionen
├───dist                         # Kompilierte JavaScript-Dateien (von tsc generiert)
│   ├───img                      # Bilder der Website
│   │       *.png
│   └───scss
│           styles.css           # von SASS kompiliertes Stylesheet
│           styles.scss          # Eigene SASS-Styles & Bootstrap Anpassungen
└───src
    │   main.ts                  # Der Programmeinsprungpunkt
    ├───data
    │       rooms.json           # Die 5 Spielräume
    ├───logic
    │       GameController.ts    # Die Haupt-Spiellogik
    │       HighscoreManager.ts  # Highscore-Verwaltung
    ├───models
    │       Player.ts            # Spieler-Datenmodell (Name, Punkte)
    └───ui
            UIRenderer.ts        # DOM-Manipulation & UI-Darstellung
```
