import { UIRenderer } from './ui/UIRenderer.js';


class GameController {
    private renderer;

    constructor() {
        this.renderer = new UIRenderer('app');
    }

    public init() {
        console.log("Ich bin in main.ts!");
        this.renderer.renderStartScreen((name, roomId, difficulty) => {
            // This code will be executed when form is submitted.
            console.log("Gestartet mit:", name, roomId, difficulty);
        });
    }
}

// Start Game
const gameController = new GameController();
gameController.init();
