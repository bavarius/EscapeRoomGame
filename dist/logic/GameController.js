import { UIRenderer } from '../ui/UIRenderer.js';
import { Player } from '../models/Player.js';
import { HighscoreManager } from './HighscoreManager.js';
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
    /**
     * Initializes the game by loading room data and rendering the start screen.
     * If the rooms.json file cannot be loaded, an error message is displayed.
     *
     * The keyword 'async' allows the use of 'await' for asynchronous operations, making it easier to work with promises.
     * The 'await' keyword pauses the execution of the function until the promise is resolved, allowing for a more synchronous-like flow.
     * This is particularly useful for fetching data from external sources, such as loading the rooms.json file in this case.
     */
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
    /**
     * Starts the game with the selected room and difficulty.
     *
     * @param name       player's name
     * @param roomId     ID of the selected room
     * @param difficulty difficulty level
     */
    startGame(name, roomId, difficulty) {
        // create player with starting points
        this.player = new Player(name, 500);
        // store room and difficulty level
        this.currentRoom = this.roomsData.find((r) => r.id === roomId);
        this.currentDifficulty = difficulty;
        this.currentPuzzleIndex = 0; // begin with 1st puzzle (index: 0)
        this.timeLeft = 90;
        this.startTimer();
        this.loadCurrentPuzzle(); // load first puzzle
    }
    /**
     * Starts the countdown timer for the game. The timer updates every second and checks if the time has run out.
     * If the time runs out, an alert is shown and the game is reset to the start screen.
     * The timer can be stopped and restarted as needed.
     */
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
    /**
     * Loads the current puzzle based on the selected room and difficulty.
     */
    loadCurrentPuzzle() {
        // fetch puzzle list for selected difficulty level
        const puzzles = this.currentRoom.difficulties[this.currentDifficulty];
        // check if all puzzles of current room are solved
        if (this.currentPuzzleIndex >= puzzles.length) {
            clearInterval(this.timerInterval);
            // Highscore speichern und aktualisierte Liste holen
            const topScores = HighscoreManager.addScore(this.player.name, this.player.points, this.currentRoom.name);
            // Sieg-Screen mit Highscore-Tabelle rendern
            this.renderer.renderVictory(this.player.points, topScores, () => this.init());
            return;
        }
        const currentPuzzle = puzzles[this.currentPuzzleIndex];
        /**
         * Render the puzzle interface using the UIRenderer. The renderer is provided with the current puzzle data, player's points, remaining time, and callback functions for handling user actions such as submitting an answer, requesting a hint, or buying extra time.
         * The callbacks are defined inline and handle the corresponding game logic, such as checking the answer, updating points, and managing the timer.
         */
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
    /**
     * Returns a random success confirmation message from the list of available messages.
     *
     * @returns random success confirmation message (String)
     */
    getSuccessConfirmationText() {
        return this.success_confirmations[Math.floor(Math.random() * this.success_confirmations.length)];
    }
    /**
     * Checks the user's answer against the correct solution for the given puzzle.
     * If the answer is correct, the player is awarded points and the next puzzle is loaded. If the answer is incorrect, points are deducted and feedback is provided.
     *
     * @param userAnswer the user's submitted answer
     * @param puzzle the current puzzle object
     */
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