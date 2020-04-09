import { Player } from '../models/player';
import { RoundState } from '../models/roundState';
import { Card } from '../models/card';
import * as utils from '../utils';

export const daggeAI: Player = {
    id: 'daggeAI',
    debugLog: false,

    playCard: function (hand: Array<Card>, roundState: RoundState, playerId: string):Card {
        // Dagge AI always plays his lowest card in the suit
        const cardsOfSuit = utils.getCardsOfSuit(hand, roundState.currentSet.suit);
        if (cardsOfSuit.length > 0) {
            return utils.getLowestValue(cardsOfSuit)[0];
        }
        else {
            // or the highest card if he doesnt have the suit
            return utils.getHighestValue(hand)[0];
        }
    },

    bet: function (hand: Array<Card>, roundState: RoundState, playerId: string): number {
        // Dagge AI always bets 0
        return 0;
    }
}