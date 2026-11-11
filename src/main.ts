import { UIRenderer } from './ui/UIRenderer.js';

class GameController {
    private renderer;
    private roomsData: any = null; // Storage for the rooms data loaded from JSON

    constructor() {
        this.renderer = new UIRenderer('app');
    }

    public async init() {
        console.log("Inside GameController.init() - Loading rooms.json...");

        try {
            // Load the rooms.json file - only works if served via a server (like Live Server), not directly from the filesystem
            const response = await fetch('./src/data/rooms.json');
            if (!response.ok) {
                throw new Error("Network error while loading rooms.json");
            }

            const data = await response.json();
            this.roomsData = data.rooms; // store rooms data

            // Create a summary of rooms for the start screen containing only id and name
            const roomSummaries = this.roomsData.map((room: any) => ({
                id: room.id,
                name: room.name
            }));

            // Render the start screen with the room summaries and a callback for when the game starts
            this.renderer.renderStartScreen(roomSummaries, (name, roomId, difficulty) => {
                this.startGame(name, roomId, difficulty);
            });
        } catch (error) {
            console.error("Error:", error);
            alert("Error while loading rooms.json. Is your Live Server running?");
        }
    }

    private startGame(name: string, roomId: string, difficulty: string) {
        console.log(`Gestartet! Spieler: ${name}, Raum-ID: ${roomId}, Modus: ${difficulty}`);

        // Test: Find the selected room from the loaded rooms data
        const selectedRoom = this.roomsData.find((r: any) => r.id === roomId);
        console.log("Gewählter Raum:", selectedRoom);

        // Continue with the game logic here, e.g., rendering the first puzzle, etc.
    }
}

// Start Game
const gameController = new GameController();
gameController.init();
