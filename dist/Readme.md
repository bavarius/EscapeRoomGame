# 🧩 Kids Escape Room Abenteuer

Ein interaktives, kinderfreundliches Solo-Escape-Room-Spiel für den Browser, entwickelt mit **TypeScript**, **Bootstrap 5 (SASS)** und dynamischen **JSON-Daten**.

---

## 🌟 Features

- **Kinderfreundliches Design:** Leuchtende Farben, kindgerechte Illustrationen und eine intuitive Benutzeroberfläche.
- **Verschiedene Abenteuer-Räume:**
  - 🌳 *Der verzauberte Zauberwald*
  - 🌊 *Unterwasser-Abenteuer*
  - 🚀 *Weltraum-Station*
- **Verschiedene Schwierigkeitsgrade:** Wählbar zwischen *Leicht* (für Einsteiger) und *Schwer* (für Profis).
- **Flexible Rätsel-Typen:** Unterstützt Texteingaben, Zahlen-Rätsel und interaktive Karten-Sequenzen (`card_grid`).
- **Punkte- & Zeitsystem:**
  - Punkte sammeln für richtige Antworten (`+100 Pkt`).
  - Punktabzug bei Fehlern (`-20 Pkt`) oder genutzten Hinweisen (`-50 Pkt`).
  - Ein spannender Countdown-Timer mit der Möglichkeit, sich mit Punkten zusätzliche Zeit zu erkaufen (`-100 Pkt` für `+30 Sek`).
- **Saubere Architektur:** Strikte Trennung von Spiel-Logik (Modelle/Controller) und DOM-Manipulation (UI-Renderer).
- **Konfigurationsbasiert:** Alle Räume und Rätsel sind extern in einer `rooms.json` gespeichert.

---

## 📁 Projektstruktur

```text
├── index.html              # Hauptseite (HTML5 + Bootstrap CDN)
├── package.json            # Projekt-Konfiguration & Skripte
├── tsconfig.json           # TypeScript Compiler-Optionen
├── dist/                   # Kompilierte JavaScript-Dateien (wird von tsc generiert)
└── src/
    ├── scss/
    │   └── main.scss       # Eigene SASS-Styles & Bootstrap Anpassungen
    ├── models/
    │   └── Player.ts       # Spieler-Datenmodell (Name, Punkte)
    ├── ui/
    │   └── UIRenderer.ts   # DOM-Manipulation & UI-Darstellung
    ├── data/
    │   └── rooms.json      # JSON-Datei mit allen Räumen & Rätseln
    └── main.ts             # Haupteinstiegspunkt & Spiel-Controller
