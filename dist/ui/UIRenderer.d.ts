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
    renderPuzzle(puzzle: any, points: number, timeLeft: number, onAnswer: (answer: any) => void, onHint: () => void, onBuyTime: () => void): void;
    updateStatusDisplay(points: number, timeLeft: number): void;
    renderVictory(points: number, onRestart: () => void): void;
}
//# sourceMappingURL=UIRenderer.d.ts.map