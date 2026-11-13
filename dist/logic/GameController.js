import { UIRenderer } from '../ui/UIRenderer.js';
import { Player } from '../models/Player.js';
/**
 * GameController class manages the game flow, including loading rooms, handling player actions, and managing the timer.
 */
export class GameController {
    renderer;
    roomsData = null;
    success_confirmations = [
        "✅ Richtig! Super gemacht!",
        "✅ Stimmt! Weiter so!",
        "✅ Bravo! Deine Eingabe war richtig!",
        "✅ Super! Das stimmt!",
        "💥 Richtig! Super gemacht!",
        "👍 Passt perfekt!",
        "😎 Cool! Weiter so!",
    ];
    player;
    currentRoom = null;
    currentDifficulty = 'easy';
    currentPuzzleIndex = 0;
    timeLeft = 90; // 90 seconds countdown timer
    timerInterval = null;
    constructor() {
        this.renderer = new UIRenderer('app');
    }
    async init() {
        try {
            const response = await fetch('./src/data/rooms.json');
            if (!response.ok)
                throw new Error("Konnte rooms.json nicht laden");
            const data = await response.json();
            this.roomsData = data.rooms;
            const roomSummaries = this.roomsData.map((room) => ({
                id: room.id,
                name: room.name
            }));
            this.renderer.renderStartScreen(roomSummaries, (name, roomId, difficulty) => {
                this.startGame(name, roomId, difficulty);
            });
        }
        catch (error) {
            console.error("Fehler:", error);
            alert("Fehler beim Laden von rooms.json. Läuft dein Live Server?");
        }
    }
    startGame(name, roomId, difficulty) {
        // create player with starting points (e.g., 500)
        this.player = new Player(name, 500);
        // store room and difficulty level
        this.currentRoom = this.roomsData.find((r) => r.id === roomId);
        this.currentDifficulty = difficulty;
        this.currentPuzzleIndex = 0; // begin with 1st puzzle (index: 0)
        this.timeLeft = 90;
        this.startTimer();
        // load first puzzle
        this.loadCurrentPuzzle();
    }
    startTimer() {
        if (this.timerInterval)
            clearInterval(this.timerInterval);
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
    loadCurrentPuzzle() {
        // fetch puzzle list for selected difficulty level
        const puzzles = this.currentRoom.difficulties[this.currentDifficulty];
        // check if all puzzles of current room are solved
        if (this.currentPuzzleIndex >= puzzles.length) {
            clearInterval(this.timerInterval);
            this.renderer.renderVictory(this.player.points, () => this.init());
            return;
        }
        const currentPuzzle = puzzles[this.currentPuzzleIndex];
        this.renderer.renderPuzzle(currentPuzzle, this.player.points, this.timeLeft, (answer) => this.checkAnswer(answer, currentPuzzle), 
        // callback for hint (-50 Punkte)
        () => {
            this.player.removePoints(50);
            this.renderer.updateStatusDisplay(this.player.points, this.timeLeft);
        }, 
        // callback for buying time (-100 points for +30 seconds)
        () => {
            if (this.player.points >= 100) {
                this.player.removePoints(100);
                this.timeLeft += 30;
                this.renderer.updateStatusDisplay(this.player.points, this.timeLeft);
                alert("⏱️ Super! Du hast dir 30 Sekunden Extra-Zeit gekauft.");
            }
            else {
                alert("❌ Du hast nicht genug Punkte, um Zeit zu kaufen! (Benötigt: 100 Pkt)");
            }
        });
    }
    getSuccessConfirmationText() {
        return this.success_confirmations[Math.floor(Math.random() * this.success_confirmations.length)];
    }
    checkAnswer(userAnswer, puzzle) {
        let isCorrect = false;
        // check if solution is an Array inside JSON (e.g. card-sequence)
        if (Array.isArray(puzzle.solution)) {
            isCorrect = Array.isArray(userAnswer) &&
                userAnswer.length === puzzle.solution.length &&
                userAnswer.every((val, index) => val === puzzle.solution[index]);
        }
        // otherwise normal String-Comparison
        else if (typeof puzzle.solution === 'string') {
            const cleanUserAnswer = String(userAnswer).trim().toUpperCase();
            const cleanSolution = puzzle.solution.trim().toUpperCase();
            isCorrect = cleanUserAnswer === cleanSolution;
        }
        if (isCorrect) {
            this.player.addPoints(100);
            // show feedback-box
            this.renderer.renderFeedback(true, `${this.getSuccessConfirmationText() + ' *** 100 Punkte ***'}`, () => {
                this.currentPuzzleIndex++;
                this.loadCurrentPuzzle();
            });
        }
        else {
            this.player.removePoints(20);
            this.renderer.updateStatusDisplay(this.player.points, this.timeLeft);
            this.renderer.renderFeedback(false, "Das war leider nicht ganz richtig. (-20 Punkte)", () => {
                this.loadCurrentPuzzle(); // reload the same puzzle
            });
        }
    }
}
//# sourceMappingURL=GameController.js.map