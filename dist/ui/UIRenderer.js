export class UIRenderer {
    appContainer;
    constructor(containerId) {
        this.appContainer = document.getElementById(containerId);
    }
    /**
     * Renders the start screen with the given rooms and start callback
     *
     * @param rooms array of rooms
     * @param onStart callback function - executed upon form submission
     */
    renderStartScreen(rooms, onStart) {
        // Create the <option>-tags dynamically from the JSON data
        const roomOptionsHtml = rooms
            .map(room => `<option value="${room.id}">${room.name}</option>`)
            .join('');
        this.appContainer.innerHTML = `
      <div class="text-center">
        <h1 class="text-primary fw-bold mb-4">🧩 Kids Escape Room</h1>
        <p class="text-muted mb-4">Wähle deinen Namen, deinen Raum und den Schwierigkeitsgrad!</p>

        <form id="start-form">
          <div class="mb-3 text-start">
            <label class="form-label fw-bold">Dein Name:</label>
            <input type="text" id="player-name" class="form-control form-control-lg" required placeholder="z.B. Isabella, Alexandra oder Henry">
          </div>

          <div class="mb-3 text-start">
            <label class="form-label fw-bold">Wähle einen Raum:</label>
            <select id="room-select" class="form-select form-select-lg">
              ${roomOptionsHtml}
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
        document.getElementById('start-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('player-name').value;
            const roomId = document.getElementById('room-select').value;
            const difficulty = document.getElementById('difficulty-select').value;
            onStart(name, roomId, difficulty);
        });
    }
    renderPuzzle(puzzle, onAnswer, onHint) {
        this.appContainer.innerHTML = `
      <div class="card bg-light border-0 p-4 shadow-sm">
        <span class="badge bg-primary mb-2 align-self-start">Rätsel</span>
        <h3 class="h4 text-primary fw-bold mb-3">${puzzle.name}</h3>
        <p class="lead mb-4">${puzzle.task}</p>

        <div id="hint-box" class="mb-3"></div>

        <form id="puzzle-form">
          <div class="mb-3">
            <input type="text" id="puzzle-answer" class="form-control form-control-lg" required placeholder="Deine Antwort hier eingeben...">
          </div>

          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-success btn-kid flex-grow-1">Antwort prüfen ✅</button>
            <button type="button" id="hint-btn" class="btn btn-outline-warning btn-kid">💡 Hinweis</button>
          </div>
        </form>
      </div>
    `;
        // event-listener for sending answer
        document.getElementById('puzzle-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const answer = document.getElementById('puzzle-answer').value;
            onAnswer(answer);
        });
        // event-listener for hint-button
        document.getElementById('hint-btn').addEventListener('click', () => {
            const hintBox = document.getElementById('hint-box');
            hintBox.innerHTML = `
        <div class="alert alert-warning py-2 mb-0">
          💡 <strong>Tipp:</strong> ${puzzle.hints[0]}
        </div>
      `;
            onHint();
        });
    }
}
//# sourceMappingURL=UIRenderer.js.map