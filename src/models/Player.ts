export class Player {
    constructor(public name: string, public points: number = 500) { }

    addPoints(amount: number) {
        this.points += amount;
    }

    removePoints(amount: number) {
        this.points = Math.max(0, this.points - amount); // Don't let amount get lower than 0.
    }
}
