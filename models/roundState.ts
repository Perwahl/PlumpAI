import { Card } from './card';
import { Player } from './player';

export type RoundState = {
    amountOfCards: number,
    sets: Array<Set>,  
    playerRoundStates: Array<PlayerRoundState>,
    currentSet: CurrentSet
}

export type Set = {
    setNumber: number, 
    cardsPlayed: Array<PlayedCard>, 
    suit: string 
}

export type PlayerRoundState = {
    playerId: string,
    bet: number,
    setsWon: number,
    isFullBet: boolean,
    invalidBet: number,
    invalidCardPlayed: number
}

export type PlayedCard = {
    playedByPlayerId: string,
    card: Card
}

export type PlayerHand = {
    playerId: string,
    hand: Array<Card>
}

export type CurrentSet = {
    setNumber: number,
    cardsPlayed: Array<PlayedCard>,
    suit: string
}