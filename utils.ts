
const constants = require('./constants');
import { Player } from './models/player';
import { Card, suits, values } from './models/card';
import { PlayerHand, RoundState, PlayerRoundState, Set, PlayedCard, CurrentSet } from './models/roundState';

// rotate player order
export const rotateRight = function(players: Array<Player>, steps: number) {
    players.unshift.apply( players, players.splice(steps, players.length));
    return players;
}

// get my highest value card OBS an array is always returned
export const getHighestValue = function (hand: Array<Card>) {

    //console.log("getting highest card of",  hand);
	let highestCard = new Array<Card>();
	let highestValue = 0;

	hand.forEach((card) => {
		const value = values.indexOf(card.value);
		if( value > highestValue){
            highestCard = new Array<Card>();
			highestCard.push(card);
			highestValue = value;
		}
		else if (value === highestValue){
			highestCard.push(card);
		}		
	});
    //console.log("highest card",  highestCard);

	return highestCard;
}

// get my lowests value card OBS an array is always returned
export const getLowestValue = function (hand: Array<Card>) {	
	let lowestCard = new Array<Card>();
	let lowestValue = 99;

	hand.forEach(card => {
		const value = values.indexOf(card.value);
		if(value < lowestValue){
            lowestCard = new Array<Card>();
			lowestCard.push(card);
			lowestValue = value;
		}
		else if(value === lowestValue){
			lowestCard.push(card);
		}		
	});

	return lowestCard;
}

// returns all cards of a higher value than the specified value
export const cardsHigherValueThan = function (cardSet: Array<Card>, value : string) {
	const higherValueCards =  cardSet.filter(card => values.indexOf(card.value)  > values.indexOf(value));
	return higherValueCards;
}

// returns all cards of a lower value than the specified value
export const cardsLowerValueThan = function (cardSet: Array<Card>, value : string) {
	const lowerValueCards =  cardSet.filter(card => values.indexOf(card.value)  < values.indexOf(value));
	return lowerValueCards;
}

// returns all cards of given suit. 
// example: suit = 'spades' returns a list of all spades in the hand
export const getCardsOfSuit = function (hand: Array<Card>, suit: string) {
	return hand.filter(card => card.suit === suit);	
}

// selects a random card from a players hand
export const getRandomCardFromHand = function (hand: Array<Card>, suit: string) {

    // if a suite is played, pick a card of the same suite
    if (suit !== constants.noCardPlayed) {
		const cardsInSameSuit = hand.filter(card => card.suit === suit);

        // check if the hand contains a card of the played suit
		if (cardsInSameSuit.length > 0) {
			const randomSuiteCard = Math.floor(Math.random() * cardsInSameSuit.length);
			return cardsInSameSuit[randomSuiteCard];
		}
	}	

	// otherwise pick a random card to play
	const randomCard = hand[Math.floor(Math.random() * hand.length)];
	return randomCard;
}