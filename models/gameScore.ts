export type GameScore = {
    playerId: string,
    scores: Array<number>,
    total: number
}

export type SimulationScore = {
    playerId: string,
    scores: Array<number>,
    total: number,
    avgScorePerGame: number,
    plumpPercentage: number,
    fullSetWinPercentage: number,
    zeroBetWinPercentage: number
}