import { Card } from './card';
import { RoundState , PlayerRoundState} from './roundState';

export type Player = {
    id: string,
    debugLog: boolean,
    state : any,
    bet: (hand: Array<Card>, roundState: RoundState, playerId: string) => number,
    playCard: (hand: Array<Card>, roundState: RoundState, playerId: string) => Card,
    roundResult: (roundResult : PlayerRoundState) => void
}
