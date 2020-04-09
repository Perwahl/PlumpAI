import { Player } from '../models/player';
import { RoundState } from '../models/roundState';
import { Card } from '../models/card';
import * as utils from '../utils';
import { noCardPlayed } from '../constants';
import { access } from 'fs';

export const randomAI: Player = {
    id: 'randomAI',
    debugLog: false,

    playCard: function (hand: Array<Card>, roundState: RoundState, playerId: string):Card {
        // this AI will pick a random card to play
	    return utils.getRandomCardFromHand(hand, roundState.currentSet.suit);
    },

    bet: function (hand: Array<Card>, roundState: RoundState, playerId: string): number {
        // this AI will bet a random number
	    return Math.floor(Math.random() * (hand.length+1));
    }
}