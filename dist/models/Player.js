export class Player {
    name;
    points;
    constructor(name, points = 500) {
        this.name = name;
        this.points = points;
    }
    addPoints(amount) {
        this.points += amount;
    }
    removePoints(amount) {
        this.points = Math.max(0, this.points - amount); // Don't let amount get lower than 0.
    }
}
//# sourceMappingURL=Player.js.map