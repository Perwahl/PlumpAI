const cloneDeep = require('clone-deep');
import * as utils from './utils';
import * as constants from './constants';
import * as deckHelper from './deckhelper';

import { Player } from './models/player';
import { Card, suits, values } from './models/card';
import { PlayerHand, RoundState, PlayerRoundState, Set, PlayedCard, CurrentSet } from './models/roundState';

export const initRound = function (players: Array<Player>, amountOfCards: number, debugLog: boolean) {

    if(debugLog)console.log('-----------------------------------------');
    if(debugLog)console.log('starting a new round with ' + amountOfCards + ' cards');

    const roundState: RoundState = {
        amountOfCards: 0,
        playerRoundStates: new Array<PlayerRoundState>(),
        sets: new Array<Set>(),
        currentSet: {
            setNumber: -1,
            cardsPlayed: new Array<PlayedCard>(),
            suit: constants.noCardPlayed
        }
    }

    roundState.amountOfCards = amountOfCards;
    const hands = new Array<PlayerHand>();    
    const deck = deckHelper.getDeck();
    deckHelper.shuffleDeck(deck);    

    // give out player hands
    players.forEach((player, index) => {
        let cards: Array<Card> = deck.splice(0, amountOfCards);
        const playerHand: PlayerHand = { playerId: player.id, hand: cards};
        hands.push(playerHand);        
    });

    let sumOfBets = 0;
    let highestBet = 0;
    let playerWithHighestBet = 0;
    // collect bets from player AI's
    if(debugLog)console.log('--- bets----');
    players.forEach((player, index) => {
        let invalidBet = 0;
        const playerHandCopy:PlayerHand = cloneDeep(hands.find(item => item.playerId === player.id));
        const roundStateCopy = cloneDeep(roundState);
        let bet = player.bet(playerHandCopy.hand, roundStateCopy, player.id);

        if (!isValidBet(bet, amountOfCards)) {            
            bet = Math.floor(Math.random() * (playerHandCopy.hand.length + 1));
            console.log("invalid bet! new bet is:", bet);
            invalidBet = 1;
        }        

        sumOfBets += bet;
        
        // if last bet, make sure it's not even
        if(index === (players.length -1) && sumOfBets === amountOfCards){
            bet = bet === amountOfCards ? bet - 1 : bet + 1;
            if(debugLog)console.log("invalid bet (all bets got even), new bet:", bet);
            //invalidBet = 1;
        }

        // keep track of the highest bet to see who the starting player is for the first set
        if(bet > highestBet){
            highestBet = bet;
            playerWithHighestBet= index;
        }

        const isFullBet = bet === amountOfCards;
        
        roundState.playerRoundStates.push({ 
            playerId: player.id,
            bet: bet,
            setsWon: 0,
            isFullBet: isFullBet,
            invalidBet: invalidBet,
            invalidCardPlayed: 0
        });
        if(debugLog)console.log(player.id + ': ' + bet);

    });

    // set starting player for the first set
    utils.rotateRight(players, playerWithHighestBet);
    
    // play sets
    roundState.sets = [];
    for(let i = 0; i < amountOfCards; i++)
	{  
       if(debugLog)console.log('----------------');
       if(debugLog)console.log('starting set ' + i + ' of ' + amountOfCards);
       if(debugLog)console.log(players[0].id + ' is starting player');

        // update current set number for this new set
        roundState.currentSet = {
            setNumber: i + 1,
            cardsPlayed: new Array<PlayedCard>(),
            suit: constants.noCardPlayed
        }
        
        // play set
        players.forEach((player) => {
            const playerHand = hands.find(hand => hand.playerId === player.id);
            if (!playerHand) {
                return;
            }
            // get player card
            const playerHandCopy = cloneDeep(playerHand);
            const roundStateCopy = cloneDeep(roundState);
            let cardToPlay = player.playCard(playerHandCopy.hand, roundStateCopy, player.id);
            
            let invalidCardPlayed = 0;
            if (!cardToPlay || !isValidCard(cardToPlay, playerHand, roundState.currentSet.suit)) {
                cardToPlay = utils.getRandomCardFromHand(playerHand.hand, roundState.currentSet.suit);

                console.log('invalid card played by ' + player.id);
                invalidCardPlayed = 1;
            }

            // register if the player tried to play an invalid card
            let playerRound = roundState.playerRoundStates.find(item => item.playerId === player.id);
            if (playerRound) {
                playerRound.invalidCardPlayed += invalidCardPlayed;
            }
            
            const indexOfCardToPlay = playerHand.hand.map(card => card.key).indexOf(cardToPlay.key);        

            // add the played to card to the current set
            roundState.currentSet.cardsPlayed.push({playedByPlayerId: player.id, card: cardToPlay})

            // if this is the first card, set the suite for the current set
            if (roundState.currentSet.suit === constants.noCardPlayed) {
                roundState.currentSet.suit = cardToPlay.suit;
            }

            // remove it from the players hand. muta-what-ability?            
            playerHand.hand.splice(indexOfCardToPlay, 1);
            if(debugLog)console.log(player.id + ':', cardToPlay);
        });

        // resolve set        
        roundState.sets[i] = roundState.currentSet;

        const setWinnerPlayerId = getSetWinner(roundState.currentSet);
        let setWinner = roundState.playerRoundStates.find((item : PlayerRoundState) => item.playerId === setWinnerPlayerId);
        const winPlayer = players.find(item => item.id === setWinnerPlayerId);
        
        if (setWinner && winPlayer) {
            setWinner.setsWon += 1;
            utils.rotateRight(players, players.indexOf(winPlayer));
        }

        if(debugLog)console.log('set winner ' + setWinnerPlayerId);
    }

    if(debugLog)console.log('round complete');
    if(debugLog)console.log(roundState);
   // console.log(roundState.playerRoundStates);
    return roundState.playerRoundStates;
}

const isValidCard = function(playedCard: Card, playerHand: PlayerHand, suit: string) {    
    if (!playedCard) {
        console.log("invalid card played! no card played");
        return false;
    }

    if (playerHand.hand.find(card => card.key === playedCard.key) === null) {
        console.log("invalid card played! not found in hand");
        return false;
    }

    const cardsOfSuit = playerHand.hand.filter(card => card.suit === suit);
    if (suit === constants.noCardPlayed || playedCard.suit === suit || cardsOfSuit.length === 0) {
        return true;
    }
}

// verify that the bet is within the amount of cards to play range
const isValidBet = function(bet: number, amountOfCards: number) {
    return bet >= 0 && bet <= amountOfCards;    
}

const getSetWinner = function(currentSet: CurrentSet) {
    let playerWithHighestCard: PlayedCard = currentSet.cardsPlayed.find(item => item.card.suit === currentSet.suit) || { playedByPlayerId: '-1', card: { suit: '-1', value: '-1', key: '-1' }};

    currentSet.cardsPlayed.forEach((playedCard) => {
        if (playedCard.card.suit === currentSet.suit && playerWithHighestCard.playedByPlayerId !== playedCard.playedByPlayerId) {                        
            const cardValueIndex = values.indexOf(playedCard.card.value);
            const highestCardValueIndex = values.indexOf(playerWithHighestCard.card.value);
            playerWithHighestCard = cardValueIndex > highestCardValueIndex ? playedCard : playerWithHighestCard;
        }        
    });

    return playerWithHighestCard.playedByPlayerId;
}