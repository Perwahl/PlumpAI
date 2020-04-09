import { Card } from './card';
import { RoundState } from './roundState';

export type Player = {
    id: string,
    debugLog: boolean,
    bet: (hand: Array<Card>, roundState: RoundState, playerId: string) => number,
    playCard: (hand: Array<Card>, roundState: RoundState, playerId: string) => Card,
}
