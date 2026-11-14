/**
 * HighscoreManager class responsible for managing highscores in localStorage
 */
export class HighscoreManager {
    static STORAGE_KEY = 'escape_room_highscores';
    // Load Highscores
    static getHighscores() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        if (!data)
            return [];
        try {
            return JSON.parse(data);
        }
        catch {
            return [];
        }
    }
    // add new Score and save
    static addScore(name, points, roomName) {
        const scores = this.getHighscores();
        const newEntry = {
            name,
            points,
            roomName,
            date: new Date().toLocaleDateString('de-DE')
        };
        scores.push(newEntry);
        // sort descending by points (highest points first)
        scores.sort((a, b) => b.points - a.points);
        // Only keep the top 5
        const topScores = scores.slice(0, 5);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(topScores));
        return topScores;
    }
}
//# sourceMappingURL=HighscoreManager.js.map