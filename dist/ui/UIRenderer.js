export class UIRenderer {
    appContainer;
    constructor(containerId) {
        this.appContainer = document.getElementById(containerId);
    }
    renderStartScreen(onStart) {
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
        document.getElementById('start-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('player-name').value;
            const roomId = document.getElementById('room-select').value;
            const difficulty = document.getElementById('difficulty-select').value;
            onStart(name, roomId, difficulty);
        });
    }
}
//# sourceMappingURL=UIRenderer.js.map