/**
 * UIRenderer class handles the rendering of the user interface for the escape room game.
 * It provides methods to render the start screen, puzzles, feedback, and victory screen.
 */
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
        // create the <option>-tags dynamically from the JSON data
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
    /**
     * Renders the puzzle interface based on its type and options
     *
     * @param puzzle    puzzle object containing the puzzle data
     * @param points    current points of the player
     * @param timeLeft  remaining time in seconds
     * @param onAnswer  callback function - executed when the user submits an answer
     * @param onHint    callback function - executed when the user requests a hint
     * @param onBuyTime callback function - executed when the user buys extra time
     */
    renderPuzzle(puzzle, points, timeLeft, onAnswer, onHint, onBuyTime) {
        let inputHtml = '';
        // Case A: The puzzle has picture cards to select from (Array).
        if (puzzle.type === 'card_grid' && puzzle.options) {
            const cardsHtml = puzzle.options.map((opt) => `
                <div class="col-6 mb-1">
                    <div class="card puzzle-card h-100 text-center p-2 shadow-sm" data-id="${opt.name}" style="cursor: pointer; border: 3px solid transparent;">
                        <img src="${opt.image}" class="card-img-top rounded" alt='${opt.name}'">
                    </div>
                </div>
                `).join('');
            inputHtml = `
                <div class="row g-2 mb-1" id="card-grid">
                ${cardsHtml}
                </div>
                <div class="alert alert-secondary py-1 text-center mb-2" id="sequence-display">Deine Auswahl: (Keine)</div>
                <button type="button" id="reset-selection" class="btn btn-outline-secondary btn-sm mb-2 w-100">Auswahl zurücksetzen 🔄</button>
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
            <!-- Display Points and Time -->
            <div class="d-flex justify-content-between align-items-center mb-3">
                <span class="badge bg-primary fs-6">⭐ Punkte: <span id="points-val">${points}</span></span>
                <span class="badge bg-warning text-dark fs-6">⏳ Zeit: <span id="timer-val">${timeLeft}</span>s</span>
            </div>

            <div class="card bg-light border-0 p-4 shadow-sm">
                <span class="badge bg-secondary mb-2 align-self-start">Rätsel</span>
                <h3 class="h4 text-primary fw-bold mb-3">${puzzle.name}</h3>
                <p class="lead mb-2">${puzzle.task}</p>

                <div id="hint-box" class="mb-3"></div>

                <form id="puzzle-form">
                ${inputHtml}
                <div class="d-grid gap-2">
                    <button type="submit" class="btn btn-success btn-kid">Antwort prüfen ✅</button>
                    <button type="button" id="hint-btn" class="btn btn-outline-info btn-sm">💡 Hinweis anzeigen (-50 Pkt)</button>
                    <button type="button" id="buy-time-btn" class="btn btn-outline-info btn-sm">⏱️ +30 Sek. kaufen (-100 Pkt)</button>
                </div>
                </form>
            </div>
            `;
        let selectedSequence = [];
        // event listeners for cards (Card Grid)
        if (puzzle.type === 'card_grid' && puzzle.options) {
            const seqDisplay = document.getElementById('sequence-display');
            document.querySelectorAll('.puzzle-card').forEach(card => {
                card.addEventListener('click', (e) => {
                    const cardEl = e.currentTarget;
                    const name = cardEl.getAttribute('data-id');
                    selectedSequence.push(name);
                    cardEl.style.borderColor = '#8A2BE2'; // visual feedback (pink frame)
                    cardEl.style.opacity = '0.6';
                    seqDisplay.textContent = `Deine Auswahl: ${selectedSequence.join(' ➔ ')}`;
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
        // send form
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
        document.getElementById('hint-btn').addEventListener('click', () => {
            const hintBox = document.getElementById('hint-box');
            hintBox.innerHTML = `
                <div class="alert alert-warning py-2 mb-0">
                💡 <strong>Tipp:</strong> ${puzzle.hints[0]}
                </div>
            `;
            onHint();
        });
        document.getElementById('buy-time-btn').addEventListener('click', () => {
            onBuyTime();
        });
    }
    /**
     * Live-update of timer & score without reloading the whole form
     *
     * @param points   current player score
     * @param timeLeft time left in seconds
     */
    updateStatusDisplay(points, timeLeft) {
        const pointsEl = document.getElementById('points-val');
        const timerEl = document.getElementById('timer-val');
        if (pointsEl)
            pointsEl.textContent = points.toString();
        if (timerEl)
            timerEl.textContent = timeLeft.toString();
    }
    /**
     * Renders the victory screen with the final score and highscores
     *
     * @param points     final player score
     * @param highscores array of highscore entries
     * @param onRestart  callback function - executed when the user wants to restart the game
     */
    renderVictory(points, highscores, onRestart) {
        const highscoreRows = highscores.map((entry, index) => `
          <tr>
            <td>#${index + 1}</td>
            <td>${entry.name}</td>
            <td>${entry.roomName}</td>
            <td class="fw-bold text-success">${entry.points} Pkt</td>
          </tr>
        `).join('');
        this.appContainer.innerHTML = `
          <div class="text-center py-3">
            <h1 class="text-success fw-bold mb-3">🎉 Herzlichen Glückwunsch! 🎉</h1>
            <p class="lead">Du hast alle Rätsel erfolgreich gelöst!</p>

            <div class="alert alert-primary fs-5 my-3">
              Dein Endstand: <strong>${points} Punkte</strong>
            </div>

            <div class="card bg-light border-0 p-3 mb-4 text-start shadow-sm">
              <h4 class="h5 text-primary fw-bold text-center mb-3">🏆 Bestenliste (Top 5)</h4>
              <table class="table table-sm table-striped mb-0">
                <thead>
                  <tr>
                    <th>Rang</th>
                    <th>Name</th>
                    <th>Raum</th>
                    <th>Punkte</th>
                  </tr>
                </thead>
                <tbody>
                  ${highscoreRows.length > 0 ? highscoreRows : '<tr><td colspan="4" class="text-center text-muted">Noch keine Einträge</td></tr>'}
                </tbody>
              </table>
            </div>

            <button id="restart-btn" class="btn btn-primary btn-kid w-100 shadow">Noch einmal spielen 🔄</button>
          </div>
        `;
        document.getElementById('restart-btn').addEventListener('click', () => {
            onRestart();
        });
    }
    /**
     * Renders feedback to the user based on their answer
     *
     * @param isCorrect indicates if the user's answer was correct
     * @param message   feedback message to display
     * @param onNext    callback function - executed when the user wants to proceed to the next puzzle
     */
    renderFeedback(isCorrect, message, onNext) {
        const alertClass = isCorrect ? 'alert-success' : 'alert-danger';
        const title = isCorrect ? '🎉 Richtig!' : '❌ Leider falsch!';
        this.appContainer.innerHTML = `
            <div class="card bg-light border-0 p-4 shadow-sm text-center">
                <div class="alert ${alertClass} fs-5 fw-bold mb-4" role="alert">
                ${title}<br>
                <span class="fs-6 fw-normal">${message}</span>
                </div>

                <button id="next-puzzle-btn" class="btn btn-primary btn-kid btn-lg w-100 shadow">
                ${isCorrect ? 'Weiter zum nächsten Rätsel 🚀' : 'Noch einmal versuchen 🔄'}
                </button>
            </div>
            `;
        document.getElementById('next-puzzle-btn').addEventListener('click', () => {
            onNext();
        });
    }
}
//# sourceMappingURL=UIRenderer.js.map