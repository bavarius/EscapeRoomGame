export declare class UIRenderer {
    private appContainer;
    constructor(containerId: string);
    renderStartScreen(onStart: (name: string, roomId: string, difficulty: string) => void): void;
    renderPuzzle(puzzle: any, points: number, timeLeft: number, onAnswer: (answer: any) => void, onHint: () => void, onBuyTime: () => void): void;
    updateTimer(timeLeft: number): void;
    renderVictory(points: number, onRestart: () => void): void;
}
//# sourceMappingURL=UIRenderer.d.ts.map