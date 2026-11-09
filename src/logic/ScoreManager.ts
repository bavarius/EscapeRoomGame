export class ScoreManager {
    static calculateHintPenalty(): number {
        return 50;
    }

    static calculateTimeBuyCost(): number {
        return 100;
    }

    static calculateWrongAnswerPenalty(): number {
        return 20;
    }

    static calculateCorrectReward(): number {
        return 100;
    }
}
