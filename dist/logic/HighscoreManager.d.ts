/**
 * Highscore Entry interface representing a single highscore entry
 */
export interface HighscoreEntry {
    name: string;
    points: number;
    roomName: string;
    date: string;
}
/**
 * HighscoreManager class responsible for managing highscores in localStorage
 */
export declare class HighscoreManager {
    private static STORAGE_KEY;
    static getHighscores(): HighscoreEntry[];
    static addScore(name: string, points: number, roomName: string): HighscoreEntry[];
}
//# sourceMappingURL=HighscoreManager.d.ts.map