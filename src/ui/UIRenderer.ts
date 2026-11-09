export class UIRenderer {
  private appContainer: HTMLElement;

  constructor(containerId: string) {
    this.appContainer = document.getElementById(containerId)!;
  }

  renderStartScreen(onStart: (name: string, roomId: string, difficulty: string) => void) {
    this.appContainer.innerHTML = `
      <div class="text-center">
        <h1 class="text-primary fw-bold mb-4">🧩 Kids Escape Room</h1>
        <p class="text-muted mb-4">Wähle deinen Namen, deinen Raum und den Schwierigkeitsgrad!</p>

        <form id="start-form">
          <div class="mb-3 text-start">
            <label class="form-label fw-bold">Dein Name:</label>
            <input type="text" id="player-name" class="form-control form-control-lg" required placeholder="z.B. Mia oder Leon">
          </div>

          <div class="mb-3 text-start">
            <label class="form-label fw-bold">Wähle einen Raum:</label>
            <select id="room-select" class="form-select form-select-lg">
              <option value="magic-forest">🌳 Der verzauberte Zauberwald</option>
              <option value="underwater">🌊 Unterwasser-Abenteuer</option>
              <option value="space">🚀 Weltraum-Station</option>
            </select>
          </div>

          <div class="mb-4 text-start">
            <label class="form-label fw-bold">Schwierigkeitsgrad:</label>
            <select id="difficulty-select" class="form-select form-select-lg">
              <option value="easy">Leicht (Für Einsteiger)</option>
              <option value="hard">Schwer (Für Profis)</option>
            </select>
          </div>

          <button type="submit" class="btn btn-primary btn-kid btn-lg w-100 shadow">Abenteuer starten! 🚀</button>
        </form>
      </div>
    `;

    document.getElementById('start-form')!.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = (document.getElementById('player-name') as HTMLInputElement).value;
      const roomId = (document.getElementById('room-select') as HTMLSelectElement).value;
      const difficulty = (document.getElementById('difficulty-select') as HTMLSelectElement).value;
      onStart(name, roomId, difficulty);
    });
  }

  renderPuzzle(puzzle: any, points: number, timeLeft: number, onAnswer: (answer: any) => void, onHint: () => void, onBuyTime: () => void) {
    let inputHtml = '';

    if (puzzle.type === 'input_text') {
      inputHtml = `<input type="text" id="puzzle-input" class="form-control form-control-lg mb-3" placeholder="Deine Lösung...">`;
    } else if (puzzle.type === 'input_number') {
      inputHtml = `<input type="number" id="puzzle-input" class="form-control form-control-lg mb-3" placeholder="Zahl eingeben...">`;
    } else if (puzzle.type === 'sequence') {
      inputHtml = `
        <p class="fw-bold">Klicke die Buttons in der richtigen Reihenfolge:</p>
        <div class="d-flex gap-2 justify-content-center mb-3 flex-wrap" id="sequence-buttons">
          <button type="button" class="btn btn-danger seq-btn" data-color="red">🔴 Rot</button>
          <button type="button" class="btn btn-warning seq-btn" data-color="yellow">🟡 Gelb</button>
          <button type="button" class="btn btn-success seq-btn" data-color="green">🟢 Grün</button>
          <button type="button" class="btn btn-info seq-btn" data-color="blue">🔵 Blau</button>
          <button type="button" class="btn btn-secondary seq-btn" data-color="pink">🟣 Pink</button>
        </div>
        <div class="alert alert-secondary py-1 text-center" id="sequence-display">Auswahl: (Leer)</div>
      `;
    }

    this.appContainer.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-3">
        <span class="badge bg-primary fs-6">⭐ Punkte: ${points}</span>
        <span class="badge bg-warning text-dark fs-6">⏳ Zeit: <span id="timer-val">${timeLeft}</span>s</span>
      </div>

      <div class="card bg-light border-0 p-3 mb-3">
        <h3 class="h5 text-primary fw-bold">${puzzle.name}</h3>
        <p class="mb-0">${puzzle.task}</p>
      </div>

      <div id="hint-container" class="mb-3"></div>

      <form id="puzzle-form">
        ${inputHtml}
        <div class="d-grid gap-2">
          <button type="submit" class="btn btn-success btn-kid">Lösung prüfen ✅</button>
          <button type="button" id="hint-btn" class="btn btn-outline-warning btn-sm">💡 Hinweis anzeigen (-50 Pkt)</button>
          <button type="button" id="buy-time-btn" class="btn btn-outline-info btn-sm">⏱️ +30 Sek. kaufen (-100 Pkt)</button>
        </div>
      </form>
    `;

    let selectedSequence: string[] = [];

    if (puzzle.type === 'sequence') {
      const seqDisplay = document.getElementById('sequence-display')!;
      document.querySelectorAll('.seq-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const color = (e.currentTarget as HTMLElement).getAttribute('data-color')!;
          selectedSequence.push(color);
          seqDisplay.textContent = `Auswahl: ${selectedSequence.join(' ➔ ')}`;
        });
      });
    }

    document.getElementById('puzzle-form')!.addEventListener('submit', (e) => {
      e.preventDefault();
      if (puzzle.type === 'sequence') {
        onAnswer(selectedSequence);
      } else {
        const val = (document.getElementById('puzzle-input') as HTMLInputElement).value;
        onAnswer(val);
      }
    });

    document.getElementById('hint-btn')!.addEventListener('click', () => {
      const hintDiv = document.getElementById('hint-container')!;
      hintDiv.innerHTML = `<div class="alert alert-warning py-2">💡 <strong>Hinweis:</strong> ${puzzle.hints[0]}</div>`;
      onHint();
    });

    document.getElementById('buy-time-btn')!.addEventListener('click', () => {
      onBuyTime();
    });
  }

  updateTimer(timeLeft: number) {
    const timerEl = document.getElementById('timer-val');
    if (timerEl) timerEl.textContent = timeLeft.toString();
  }

  renderVictory(points: number, onRestart: () => void) {
    this.appContainer.innerHTML = `
      <div class="text-center py-4">
        <h1 class="text-success fw-bold mb-3">🎉 Herzlichen Glückwunsch! 🎉</h1>
        <p class="lead">Du hast alle Rätsel erfolgreich gelöst und den Escape Room bezwungen!</p>
        <div class="alert alert-primary fs-4 my-4">
          Dein Endstand: <strong>${points} Punkte</strong>
        </div>
        <button id="restart-btn" class="btn btn-primary btn-kid w-100">Noch einmal spielen 🔄</button>
      </div>
    `;
    document.getElementById('restart-btn')!.addEventListener('click', onRestart);
  }
}
