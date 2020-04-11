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
    5) the roundResult function allows you to check how the round went but this function doesnt matter for the game
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

        // NOTE! ALL THIS CODE BELOW IS EXAMPLE CODE ! PLEASE REMOVE AND/OR REWRITE AS YOU LIKE
        // TO MORE IN DEPTH UNDERSTAND THE STATE OF THE GAME (STORED IN THE VARIABLE roundState) SEE THE MODELS FOLDER AND ALL THE MODELS IN CARD.ts AND ROUNDSTATE.ts

        // check what current suit is played
        let suitPlayed = roundState.currentSet.suit;

        // if no card is played we are the first player
        if (suitPlayed === noCardPlayed) {
            // we can then play any card we like
	        return utils.getRandomCardFromHand(hand, roundState.currentSet.suit);
        }

        // otherwise, checkout what cards has been played (we know what the current suit is already)
        // roundState.currentSet.cardsPlayed contains an array of objects containing playerIDs and what card they played
        // to only get the played card, we need to extract those to a new array. the map function is a built in function on the Array object 
        // that iterates over every item in the Array and returns something to a new Array
        const cardsAlreadyPlayed = roundState.currentSet.cardsPlayed.map(cardsPlayed => cardsPlayed.card);

        // now we can see for example if other AIs has discarded cards ('sakat') if they didnt have the current played suit
        const cardsPlayedOfCurrentSuit = utils.getCardsOfSuit(cardsAlreadyPlayed, suitPlayed);

        // do stuff..

        // get my own card of the current suit
        const myCardsOfCurrentSuit = utils.getCardsOfSuit(hand, suitPlayed);

        // play e.g. the highest of these
        if (myCardsOfCurrentSuit && myCardsOfCurrentSuit.length > 0) {
            // getHighestValue returns an array (in case you give it your entire hand and not only a specific suit of cards)
            // by using the [0] we select the card at position 0 (the first card) in the array given back
            return utils.getHighestValue(myCardsOfCurrentSuit)[0];            
        }

        // otherwise play a random card if I dont have the current suit.
        return utils.getRandomCardFromHand(hand, roundState.currentSet.suit);
    },    

    roundResult: function (result : PlayerRoundState) {

    }
}
