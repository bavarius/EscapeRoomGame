import { UIRenderer } from './ui/UIRenderer.js';
import { Player } from './models/Player.js';

class GameController {
    private renderer;
    private roomsData: any = null;
    private success_confirmations = [
        "✅ Richtig! Super gemacht!",
        "✅ Stimmt! Weiter so!",
        "✅ Bravo! Deine Eingabe war richtig!",
        "✅ Super! Das stimmt!",
        "💥 Richtig! Super gemacht!",
        "👍 Passt perfekt!",
        "😎 Cool! Weiter so!",
    ];

    private player!: Player;
    private currentRoom: any = null;
    private currentDifficulty: string = 'easy';
    private currentPuzzleIndex: number = 0;

    private timeLeft: number = 90; // 90 Sekunden Startzeit pro Raum
    private timerInterval: any = null;

    constructor() {
        this.renderer = new UIRenderer('app');
    }

    public async init() {
        try {
            const response = await fetch('./src/data/rooms.json');
            if (!response.ok) throw new Error("Konnte rooms.json nicht laden");

            const data = await response.json();
            this.roomsData = data.rooms;

            const roomSummaries = this.roomsData.map((room: any) => ({
                id: room.id,
                name: room.name
            }));

            this.renderer.renderStartScreen(roomSummaries, (name, roomId, difficulty) => {
                this.startGame(name, roomId, difficulty);
            });

        } catch (error) {
            console.error("Fehler:", error);
            alert("Fehler beim Laden von rooms.json. Läuft dein Live Server?");
        }
    }

    private startGame(name: string, roomId: string, difficulty: string) {
        // Spieler mit Startpunkten (z.B. 500) erstellen
        this.player = new Player(name, 500);
        // store room and difficulty level
        this.currentRoom = this.roomsData.find((r: any) => r.id === roomId);
        this.currentDifficulty = difficulty;
        this.currentPuzzleIndex = 0; // begin with 1st puzzle (index: 0)
        this.timeLeft = 90;

        this.startTimer();
        // load first puzzle
        this.loadCurrentPuzzle();
    }

    private startTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);

        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.renderer.updateStatusDisplay(this.player.points, this.timeLeft);

            if (this.timeLeft <= 0) {
                this.timeLeft = 0;
                clearInterval(this.timerInterval);
                alert("⏰ Die Zeit ist abgelaufen! Das Abenteuer ist vorbei.");
                this.init(); // back to start
            }
        }, 1000);
    }

    private loadCurrentPuzzle() {
        // fetch puzzle list for selected difficulty level
        const puzzles = this.currentRoom.difficulties[this.currentDifficulty];

        // check if all puzzles of current room are solved
        if (this.currentPuzzleIndex >= puzzles.length) {
            clearInterval(this.timerInterval);
            this.renderer.renderVictory(this.player.points, () => this.init());
            return;
        }

        const currentPuzzle = puzzles[this.currentPuzzleIndex];

        this.renderer.renderPuzzle(
            currentPuzzle,
            this.player.points,
            this.timeLeft,
            (answer) => this.checkAnswer(answer, currentPuzzle),
            // Callback für Hinweis (-50 Punkte)
            () => {
                this.player.removePoints(50);
                this.renderer.updateStatusDisplay(this.player.points, this.timeLeft);
            },
            // Callback für Zeit kaufen (-100 Punkte für +30 Sekunden)
            () => {
                if (this.player.points >= 100) {
                    this.player.removePoints(100);
                    this.timeLeft += 30;
                    this.renderer.updateStatusDisplay(this.player.points, this.timeLeft);
                    alert("⏱️ Super! Du hast dir 30 Sekunden Extra-Zeit gekauft.");
                } else {
                    alert("❌ Du hast nicht genug Punkte, um Zeit zu kaufen! (Benötigt: 100 Pkt)");
                }
            }
        );
    }

    private getSuccessConfirmationText() {
        return this.success_confirmations[Math.floor(Math.random() * this.success_confirmations.length)];
    }

    private checkAnswer(userAnswer: any, puzzle: any) {
        let isCorrect = false;

        // Check if solution is an Array inside JSON (e.g. card-sequence)
        if (Array.isArray(puzzle.solution)) {
            // Array-Comparison: Sequence matching?
            isCorrect = Array.isArray(userAnswer) &&
                userAnswer.length === puzzle.solution.length &&
                userAnswer.every((val, index) => val === puzzle.solution[index]);
        }
        // Otherwise normal String-Comparison
        else if (typeof puzzle.solution === 'string') {
            const cleanUserAnswer = String(userAnswer).trim().toUpperCase();
            const cleanSolution = puzzle.solution.trim().toUpperCase();
            isCorrect = cleanUserAnswer === cleanSolution;
        }

        if (isCorrect) {
            alert(`${this.getSuccessConfirmationText() + ' *** 100 Punkte ***'}`);
            this.player.addPoints(100); // bonus for correct answer
            this.currentPuzzleIndex++;
            this.loadCurrentPuzzle();
        } else {
            alert("❌ Leider falsch! -20 Punkte.");
            this.player.removePoints(20); // penalty for wrong answer
            this.renderer.updateStatusDisplay(this.player.points, this.timeLeft);
        }
    }
}

// Start Game
const gameController = new GameController();
gameController.init();
