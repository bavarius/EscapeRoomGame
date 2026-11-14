/**
 * UIRenderer class handles the rendering of the user interface for the escape room game.
 * It provides methods to render the start screen, puzzles, feedback, and victory screen.
 */
export declare class UIRenderer {
    private appContainer;
    constructor(containerId: string);
    /**
     * Renders the start screen with the given rooms and start callback
     *
     * @param rooms array of rooms
     * @param onStart callback function - executed upon form submission
     */
    renderStartScreen(rooms: Array<{
        id: string;
        name: string;
    }>, onStart: (name: string, roomId: string, difficulty: string) => void): void;
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
    renderPuzzle(puzzle: any, points: number, timeLeft: number, onAnswer: (answer: any) => void, onHint: () => void, onBuyTime: () => void): void;
    /**
     * Live-update of timer & score without reloading the whole form
     *
     * @param points   current player score
     * @param timeLeft time left in seconds
     */
    updateStatusDisplay(points: number, timeLeft: number): void;
    /**
     * Renders the victory screen with the final score and highscores
     *
     * @param points     final player score
     * @param highscores array of highscore entries
     * @param onRestart  callback function - executed when the user wants to restart the game
     */
    renderVictory(points: number, highscores: Array<{
        name: string;
        points: number;
        roomName: string;
        date: string;
    }>, onRestart: () => void): void;
    /**
     * Renders feedback to the user based on their answer
     *
     * @param isCorrect indicates if the user's answer was correct
     * @param message   feedback message to display
     * @param onNext    callback function - executed when the user wants to proceed to the next puzzle
     */
    renderFeedback(isCorrect: boolean, message: string, onNext: () => void): void;
}
//# sourceMappingURL=UIRenderer.d.ts.map