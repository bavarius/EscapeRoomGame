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
        let inputHtml = '';
        // Case A: The puzzle has picture cards to select from (Array).
        if (puzzle.type === 'card_grid' && puzzle.options) {
            const cardsHtml = puzzle.options.map((opt) => `
                <div class="col-6 mb-3">
                    <div class="card puzzle-card h-100 text-center p-2 shadow-sm" data-id="${opt.id}" style="cursor: pointer; border: 3px solid transparent;">
                        <img src="${opt.image}" class="card-img-top rounded" alt="${opt.name}" style="height: 160px; object-fit: cover;">
                        <div class="card-body p-1">
                            <small class="fw-bold">${opt.name}</small>
                        </div>
                    </div>
                </div>
                `).join('');
            inputHtml = `
                <p class="fw-bold">Klicke die Karten in der richtigen Reihenfolge an:</p>
                <div class="row g-2 mb-3" id="card-grid">
                ${cardsHtml}
                </div>
                <div class="alert alert-secondary py-1 text-center mb-3" id="sequence-display">Deine Auswahl: (Keine)</div>
                <button type="button" id="reset-selection" class="btn btn-outline-secondary btn-sm mb-3 w-100">Auswahl zurücksetzen 🔄</button>
            `;
        }
        // Case B: Classic Text Input Puzzle
        else {
            inputHtml = `
                <div class="mb-3">
                <input type="text" id="puzzle-answer" class="form-control form-control-lg" required placeholder="Deine Antwort hier eingeben...">
                </div>
            `;
        }
        this.appContainer.innerHTML = `
            <div class="card bg-light border-0 p-4 shadow-sm">
                <span class="badge bg-primary mb-2 align-self-start">Rätsel</span>
                <h3 class="h4 text-primary fw-bold mb-3">${puzzle.name}</h3>
                <p class="lead mb-4">${puzzle.task}</p>

                <div id="hint-box" class="mb-3"></div>

                <form id="puzzle-form">
                ${inputHtml}
                <div class="d-flex gap-2">
                    <button type="submit" id="submit-btn" class="btn btn-success btn-kid flex-grow-1">Antwort prüfen ✅</button>
                    <button type="button" id="hint-btn" class="btn btn-outline-warning btn-kid">💡 Hinweis</button>
                </div>
                </form>
            </div>
            `;
        let selectedSequence = [];
        // Logic for clicking sequence of cards (Card Grid)
        if (puzzle.type === 'card_grid' && puzzle.options) {
            const seqDisplay = document.getElementById('sequence-display');
            document.querySelectorAll('.puzzle-card').forEach(card => {
                card.addEventListener('click', (e) => {
                    const cardEl = e.currentTarget;
                    const id = cardEl.getAttribute('data-id');
                    // Verhindern, dass dieselbe Karte mehrfach in der Sequenz landet (optional)
                    if (!selectedSequence.includes(id)) {
                        selectedSequence.push(id);
                        cardEl.style.borderColor = '#8A2BE2'; // Visuelles Feedback (Violetter Rahmen)
                        cardEl.style.opacity = '0.6';
                        // Textanzeige aktualisieren
                        seqDisplay.textContent = `Deine Auswahl: ${selectedSequence.join(' ➔ ')}`;
                    }
                });
            });
            // reset-button for selection
            document.getElementById('reset-selection').addEventListener('click', () => {
                selectedSequence = [];
                seqDisplay.textContent = `Deine Auswahl: (Keine)`;
                document.querySelectorAll('.puzzle-card').forEach(c => {
                    c.style.borderColor = 'transparent';
                    c.style.opacity = '1';
                });
            });
        }
        // Send Form
        document.getElementById('puzzle-form').addEventListener('submit', (e) => {
            e.preventDefault();
            if (puzzle.type === 'card_grid') {
                onAnswer(selectedSequence); // passes an Array (e.g. ["green", "yellow"])
            }
            else {
                const answer = document.getElementById('puzzle-answer').value;
                onAnswer(answer); // passes a String
            }
        });
        // Hinweis-Button
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