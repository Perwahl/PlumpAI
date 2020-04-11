import { Player } from '../models/player';
import { PlayerHand, RoundState, PlayerRoundState, Set, PlayedCard, CurrentSet } from '../models/roundState';
import { Card, suits, values } from '../models/card';
import * as utils from '../utils';
import { noCardPlayed } from '../constants';

/*
    1) copy and rename this file e.g. 'TobbeAI'
    2) rename the exported variable 'customAI' e.g. 
        export const customAI: Player should become export const customAI: Player
    3) write the bet function, it should return a number between 0 and amount of cards in your hand
    4) write the playCard function, it should return a card from yout hand

    TIPS AND TRIX
    utils contains some helper functions to e.g. get all cards of a specific suit
    roundState contains all visible information about the current round
    {
        amountOfCards: number,                      // amount of cards to play this round, e.g. 5 cards
        sets: Array<Set>,                           // stick in swedish, contains the history of sets that have been played
        playerRoundStates: Array<PlayerRoundState>, // contains bets and how many sets each player has won
        currentSet: CurrentSet                      // contains information about the ongoing set being played, which cards have been played an what suit is being played
    }

    LAST WORDS
    Happy coding quarantine!
*/ 

//change this!  v
export const customAI: Player = {
    id: 'CUSTOMAI', // rename the ID of your AI e.g. 'TobbeAI'
    debugLog: false, // if you want your AI to have some extra logging you can use this flag:  if(this.debugLog)console.log("my hand", hand);
    state: {}, // if your AI wants to use a custom state, for example to remember things between rounds/sets, you can use this property. Example: state.lastCardPlayed = card;

    bet: function (hand: Array<Card>, roundState: RoundState, playerId: string): number {
        // this AI will bet a random number
	    return Math.floor(Math.random() * (hand.length+1));
    },

    playCard: function (hand: Array<Card>, roundState: RoundState, playerId: string):Card {
        // this AI will pick a random card to play
	    return utils.getRandomCardFromHand(hand, roundState.currentSet.suit);
    } ,

    roundResult: function (result : PlayerRoundState) {

    }
}