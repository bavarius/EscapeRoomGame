import { UIRenderer } from './ui/UIRenderer.js';

class GameController {
    private renderer;
    private roomsData: any = null;

    // new game state
    private currentRoom: any = null;
    private currentDifficulty: string = 'easy';
    private currentPuzzleIndex: number = 0;

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
        console.log(`Spieler: ${name} gestartet im Raum: ${roomId} (${difficulty})`);

        // store room and difficulty level
        this.currentRoom = this.roomsData.find((r: any) => r.id === roomId);
        this.currentDifficulty = difficulty;
        this.currentPuzzleIndex = 0; // begin with 1st puzzle (index: 0)

        // load first puzzle
        this.loadCurrentPuzzle();
    }

    private loadCurrentPuzzle() {
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
        this.renderer.renderPuzzle(
            currentPuzzle,
            (answer) => this.checkAnswer(answer, currentPuzzle),
            () => { console.log("Hinweis wurde angefordert"); }
        );
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
            alert("✅ Richtig! Super gemacht!");
            this.currentPuzzleIndex++;
            this.loadCurrentPuzzle();
        } else {
            alert("❌ Leider falsch oder unvollständig. Probier es noch einmal!");
        }
    }
}

// Start Game
const gameController = new GameController();
gameController.init();
