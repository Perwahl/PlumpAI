import { Player } from '../models/player';
import { RoundState, PlayerRoundState } from '../models/roundState';
import { Card } from '../models/card';
import * as utils from '../utils';
import * as constants from '../constants';
import { debuglog } from 'util';

export const simpleAI: Player = {
    id: 'simpleAI',
    debugLog: false,
    state: {},

    playCard: function (hand: Array<Card>, roundState: RoundState, playerId: string): Card {
        const myRoundState = roundState.playerRoundStates.find(roundstate => roundstate.playerId === playerId);

        if(this.debugLog)console.log("it's my turn to play a card, suit is " + roundState.currentSet.suit);
        if(this.debugLog)console.log("my hand", hand);
        if(this.debugLog)console.log("my bet this turn was " + myRoundState?.bet + " and I have won " + myRoundState?.setsWon);

        // am I playing the first card this set?
        if(roundState.currentSet.suit === constants.noCardPlayed){
            // yes, do I want to win more sets?
            if(myRoundState && myRoundState.bet > myRoundState.setsWon){
                // yes, play my highest card of any suit
                 const card = utils.getHighestValue(hand)[0];
                if(this.debugLog)console.log("I'm playing first and I need to win sets, I'm playing my highest card", card);

                 return card;
            }
            else if(myRoundState)
            {
                // no,  play my lowest card of any suit
                const card = utils.getLowestValue(hand)[0];
                if(this.debugLog)console.log("I'm playing first and I don't need to win sets, I'm playing my lowest card", card);

                return card;
            }
        }
        
        // do I have a same suit card to play?
        const cardsOfPlayedSuit = utils.getCardsOfSuit(hand, roundState.currentSet.suit);
        if (cardsOfPlayedSuit.length === 0) {
            //nope, discard a random card
            const randomCard = Math.floor(Math.random() * hand.length);
            //console.log('no card of suit, playing random card');
            if(this.debugLog)console.log("I don't have any cards in " + roundState.currentSet.suit + ". I'm just gonna play a random card" , hand[randomCard]);


            return hand[randomCard];
        }

        // do I need to win more sets?
        if (myRoundState && myRoundState.bet > myRoundState.setsWon) {
            //yes, play the highest value card of the played suite
            const card = utils.getHighestValue(utils.getCardsOfSuit(hand, roundState.currentSet.suit))[0];
            if(this.debugLog)console.log("I need to win more sets, I'm playing my highest card in " + roundState.currentSet.suit, card);

            return card;
        }
        // no, play the lowest valid card;
        else if (myRoundState && myRoundState.bet === myRoundState.setsWon) {
            const card = utils.getLowestValue(utils.getCardsOfSuit(hand, roundState.currentSet.suit))[0];
            if(this.debugLog)console.log("I don't need more sets, I'm playing my lowest card in " + roundState.currentSet.suit, card);

            return card;
        }
        // tjock, play a random card'
        const card = utils.getRandomCardFromHand(hand, roundState.currentSet.suit);
        if(this.debugLog)console.log("I'm already tjock, playing a random card ",  card);
        return card;
    },

    bet: function (hand: Array<Card>, roundState: RoundState, playerId: string): number {
        // this AI will bet a random number between 0 and 2.
        const bet =  Math.floor(Math.random() * Math.min(hand.length + 1, 3));

        if(this.debugLog)console.log("It's a new round with " + roundState.amountOfCards + " cards. I'm gonna bet " +  bet);

        return bet;
    },

    roundResult: function (result : PlayerRoundState) {

    }
}