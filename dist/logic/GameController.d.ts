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
    init(): Promise<void>;
    private startGame;
    private startTimer;
    private loadCurrentPuzzle;
    private getSuccessConfirmationText;
    private checkAnswer;
}
//# sourceMappingURL=GameController.d.ts.map