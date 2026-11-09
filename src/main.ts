import { Player } from './models/Player.js';
import { UIRenderer } from './ui/UIRenderer.js';
import { ScoreManager } from './logic/ScoreManager.js';

class GameController {
    private renderer = new UIRenderer('app');
    private player!: Player;
    private roomsData: any = null;
    private currentRoom: any = null;
    private currentDifficulty: string = 'easy';
    private currentPuzzleIndex: number = 0;
    private timeLeft: number = 90;
    private timerInterval: any = null;

    async init() {
        try {
            // JSON-Daten laden (Pfad relativ zur index.html oder absolut vom Webserver)
            const response = await fetch('./src/data/rooms.json');
            if (!response.ok) throw new Error("Konnte rooms.json nicht laden");
            this.roomsData = await response.json();

            this.renderer.renderStartScreen((name, roomId, difficulty) => {
                this.startGame(name, roomId, difficulty);
            });
        } catch (error) {
            console.error("Fehler beim Initialisieren:", error);
            alert("Fehler beim Laden der Spieldaten. Bitte starte über einen lokalen Live-Server!");
        }
    }

    private startGame(name: string, roomId: string, difficulty: string) {
        this.player = new Player(name, 500);
        this.currentDifficulty = difficulty;
        this.currentRoom = this.roomsData.rooms.main?.find ? null : this.roomsData.rooms.find((r: any) => r.id === roomId);
        this.currentPuzzleIndex = 0;
        this.timeLeft = 90;

        this.startTimer();
        this.loadCurrentPuzzle();
    }

    private startTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.renderer.updateTimer(this.timeLeft);

            if (this.timeLeft <= 0) {
                this.timeLeft = 0;
            }
        }, 1000);
    }

    private loadCurrentPuzzle() {
        const puzzles = this.currentRoom.difficulties[this.currentDifficulty];
        if (this.currentPuzzleIndex >= puzzles.length) {
            clearInterval(this.timerInterval);
            this.renderer.renderVictory(this.player.points, () => this.init());
            return;
        }

        const puzzle = puzzles[this.currentPuzzleIndex];
        this.renderer.renderPuzzle(
            puzzle,
            this.player.points,
            this.timeLeft,
            (answer) => this.handleAnswer(answer, puzzle),
            () => {
                this.player.removePoints(ScoreManager.calculateHintPenalty());
            },
            () => {
                const cost = ScoreManager.calculateTimeBuyCost();
                if (this.player.points >= cost) {
                    this.player.removePoints(cost);
                    this.timeLeft += 30;
                    alert("⏱️ 30 Sekunden hinzugefügt!");
                    this.renderer.updateTimer(this.timeLeft);
                } else {
                    alert("❌ Zu wenig Punkte, um Zeit zu kaufen!");
                }
            }
        );
    }

    private handleAnswer(answer: any, puzzle: any) {
        let isCorrect = false;

        if (puzzle.type === 'sequence') {
            isCorrect = JSON.stringify(answer) === JSON.stringify(puzzle.solution);
        } else {
            isCorrect = answer.trim().toUpperCase() === puzzle.solution.toUpperCase();
        }

        if (isCorrect) {
            alert("✅ Richtig! Weiter zum nächsten Rätsel.");
            this.player.addPoints(ScoreManager.calculateCorrectReward());
            this.currentPuzzleIndex++;
            this.loadCurrentPuzzle();
        } else {
            alert("❌ Leider falsch! Versuche es noch einmal.");
            this.player.removePoints(ScoreManager.calculateWrongAnswerPenalty());
            // Punkteanzeige aktualisieren ohne das Rätsel neu zu laden
        }
    }
}

// Spiel starten
new GameController().init();

console.log("Ich bin in main.ts!")
