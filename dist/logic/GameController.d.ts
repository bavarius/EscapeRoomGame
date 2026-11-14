/**
 * GameController class manages the game flow, including loading rooms, handling player actions, and managing the timer.
 */
export declare class GameController {
    private renderer;
    private roomsData;
    private success_confirmations;
    private player;
    private currentRoom;
    private currentDifficulty;
    private currentPuzzleIndex;
    private timeLeft;
    private timerInterval;
    constructor();
    /**
     * Initializes the game by loading room data and rendering the start screen.
     * If the rooms.json file cannot be loaded, an error message is displayed.
     *
     * The keyword 'async' allows the use of 'await' for asynchronous operations, making it easier to work with promises.
     * The 'await' keyword pauses the execution of the function until the promise is resolved, allowing for a more synchronous-like flow.
     * This is particularly useful for fetching data from external sources, such as loading the rooms.json file in this case.
     */
    init(): Promise<void>;
    /**
     * Starts the game with the selected room and difficulty.
     *
     * @param name       player's name
     * @param roomId     ID of the selected room
     * @param difficulty difficulty level
     */
    private startGame;
    /**
     * Starts the countdown timer for the game. The timer updates every second and checks if the time has run out.
     * If the time runs out, an alert is shown and the game is reset to the start screen.
     * The timer can be stopped and restarted as needed.
     */
    private startTimer;
    /**
     * Loads the current puzzle based on the selected room and difficulty.
     */
    private loadCurrentPuzzle;
    /**
     * Returns a random success confirmation message from the list of available messages.
     *
     * @returns random success confirmation message (String)
     */
    private getSuccessConfirmationText;
    /**
     * Checks the user's answer against the correct solution for the given puzzle.
     * If the answer is correct, the player is awarded points and the next puzzle is loaded. If the answer is incorrect, points are deducted and feedback is provided.
     *
     * @param userAnswer the user's submitted answer
     * @param puzzle the current puzzle object
     */
    private checkAnswer;
}
//# sourceMappingURL=GameController.d.ts.map