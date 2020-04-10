export type GameScore = {
    playerId: string,
    scores: Array<number>,
    total: number,
    invalidBets: number,
    invalidCardPlays: number,
    plumps: number,
    zeroBetWins: number,
    fullBetWins: number
}

export type SimulationScore = {
    playerId: string,    
    totalScore: number,    
    totalPlumps: number,    
    totalFullSetWins: number,    
    totalZeroBetWins: number,    
    invalidCardPlays: number,
    invalidBets: number
}