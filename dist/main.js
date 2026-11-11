import { UIRenderer } from './ui/UIRenderer.js';
class GameController {
    renderer;
    roomsData = null;
    // new game state
    currentRoom = null;
    currentDifficulty = 'easy';
    currentPuzzleIndex = 0;
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
        console.log(`Spieler: ${name} gestartet im Raum: ${roomId} (${difficulty})`);
        // store room and difficulty level
        this.currentRoom = this.roomsData.find((r) => r.id === roomId);
        this.currentDifficulty = difficulty;
        this.currentPuzzleIndex = 0; // begin with 1st puzzle (index: 0)
        // load first puzzle
        this.loadCurrentPuzzle();
    }
    loadCurrentPuzzle() {
        // fetch puzzle list for selected difficulty level
        const puzzles = this.currentRoom.difficulties[this.currentDifficulty];
        // check if all puzzles of current room are solved
        if (this.currentPuzzleIndex >= puzzles.length) {
            alert("🎉 Wow! Du hast alle Rätsel in diesem Raum gelöst!");
            this.init(); // back to start screen
            return;
        }
        const currentPuzzle = puzzles[this.currentPuzzleIndex];
        // pass to renderer
        this.renderer.renderPuzzle(currentPuzzle, (answer) => this.checkAnswer(answer, currentPuzzle), () => { console.log("Hinweis wurde angefordert"); });
    }
    checkAnswer(userAnswer, puzzle) {
        // check answer, ignore character case, remove spaces
        const isCorrect = userAnswer.trim().toUpperCase() === puzzle.solution.toUpperCase();
        if (isCorrect) {
            alert("✅ Richtig! Super gemacht!");
            this.currentPuzzleIndex++; // jump to next puzzle
            this.loadCurrentPuzzle();
        }
        else {
            alert("❌ Leider falsch. Probier es noch einmal!");
        }
    }
}
// Start Game
const gameController = new GameController();
gameController.init();
//# sourceMappingURL=main.js.map