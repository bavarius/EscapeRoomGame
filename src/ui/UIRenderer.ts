export class UIRenderer {
    private appContainer: HTMLElement;

    constructor(containerId: string) {
        this.appContainer = document.getElementById(containerId)!;
    }

    /**
     * Renders the start screen with the given rooms and start callback
     *
     * @param rooms array of rooms
     * @param onStart callback function - executed upon form submission
     */
    renderStartScreen(rooms: Array<{ id: string; name: string }>, onStart: (name: string, roomId: string, difficulty: string) => void) {
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

        document.getElementById('start-form')!.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = (document.getElementById('player-name') as HTMLInputElement).value;
            const roomId = (document.getElementById('room-select') as HTMLSelectElement).value;
            const difficulty = (document.getElementById('difficulty-select') as HTMLSelectElement).value;
            onStart(name, roomId, difficulty);
        });
    }

    renderPuzzle(
        puzzle: any,
        points: number,
        timeLeft: number,
        onAnswer: (answer: any) => void,
        onHint: () => void,
        onBuyTime: () => void
    ) {
        let inputHtml = '';

        // Case A: The puzzle has picture cards to select from (Array).
        if (puzzle.type === 'card_grid' && puzzle.options) {
            const cardsHtml = puzzle.options.map((opt: any) => `
                <div class="col-6 mb-3">
                    <div class="card puzzle-card h-100 text-center p-2 shadow-sm" data-id="${opt.name}" style="cursor: pointer; border: 3px solid transparent;">
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
            <!-- Display Points and Time -->
            <div class="d-flex justify-content-between align-items-center mb-3">
                <span class="badge bg-primary fs-6">⭐ Punkte: <span id="points-val">${points}</span></span>
                <span class="badge bg-warning text-dark fs-6">⏳ Zeit: <span id="timer-val">${timeLeft}</span>s</span>
            </div>

            <div class="card bg-light border-0 p-4 shadow-sm">
                <span class="badge bg-secondary mb-2 align-self-start">Rätsel</span>
                <h3 class="h4 text-primary fw-bold mb-3">${puzzle.name}</h3>
                <p class="lead mb-4">${puzzle.task}</p>

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

        let selectedSequence: string[] = [];

        // Logic for clicking sequence of cards (Card Grid)
        if (puzzle.type === 'card_grid' && puzzle.options) {
            const seqDisplay = document.getElementById('sequence-display')!;

            document.querySelectorAll('.puzzle-card').forEach(card => {
                card.addEventListener('click', (e) => {
                    const cardEl = e.currentTarget as HTMLElement;
                    const name = cardEl.getAttribute('data-id')!;

                    selectedSequence.push(name);
                    cardEl.style.borderColor = '#8A2BE2'; // visual feedback (pink frame)
                    cardEl.style.opacity = '0.6';
                    seqDisplay.textContent = `Deine Auswahl: ${selectedSequence.join(' ➔ ')}`;
                });
            });

            // reset-button for selection
            document.getElementById('reset-selection')!.addEventListener('click', () => {
                selectedSequence = [];
                seqDisplay.textContent = `Deine Auswahl: (Keine)`;
                document.querySelectorAll('.puzzle-card').forEach(c => {
                    (c as HTMLElement).style.borderColor = 'transparent';
                    (c as HTMLElement).style.opacity = '1';
                });
            });
        }

        // Send Form
        document.getElementById('puzzle-form')!.addEventListener('submit', (e) => {
            e.preventDefault();
            if (puzzle.type === 'card_grid') {
                onAnswer(selectedSequence); // passes an Array (e.g. ["green", "yellow"])
            } else {
                const answer = (document.getElementById('puzzle-answer') as HTMLInputElement).value;
                onAnswer(answer); // passes a String
            }
        });

        document.getElementById('hint-btn')!.addEventListener('click', () => {
            const hintBox = document.getElementById('hint-box')!;
            hintBox.innerHTML = `
                <div class="alert alert-warning py-2 mb-0">
                💡 <strong>Tipp:</strong> ${puzzle.hints[0]}
                </div>
            `;
            onHint();
        });

        document.getElementById('buy-time-btn')!.addEventListener('click', () => {
            onBuyTime();
        });
    }

    // live-update of timer & score without reloading the whole form
    updateStatusDisplay(points: number, timeLeft: number) {
        const pointsEl = document.getElementById('points-val');
        const timerEl = document.getElementById('timer-val');
        if (pointsEl) pointsEl.textContent = points.toString();
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
