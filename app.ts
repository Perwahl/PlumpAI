const cloneDeep = require('clone-deep');
import * as roundManager from './roundManager';
import * as utils from './utils';
import { PlayerRoundState } from './models/roundState';
import { GameScore, SimulationScore } from './models/gameScore';
import { Player } from './models/player';
import { SimulationConfig } from './models/simulationConfig';

/*
* WELCOME!
* YOU ARE CHALLENGED TO THE GREAT QUARANTINE EASTER PLUMP AI CHAMPOPNSOSPPSSS
* 
* HOW TO PLAY:
* 1) COPY CUSTOMAI.ts in the players folder and follow the instructions there, you can check the simpleAI for more example code
* 2) IMPORT THE AI BELOW, SEE DAGGEAI FOR AN EXAMPLE
* 3) EDIT THE SIMULATION CONFIG AND CHANGE ONE OF THE OTHER AI'S WITH YOURS
*/

// AIs imported here
import { simpleAI } from './players/SimpleAI';
import { randomAI } from './players/randomAI';
import { customAI } from './players/CUSTOMAI';


const simulationConfig: SimulationConfig = {
    gamesToRun: 1000,
    debugLogs: false,
    playersConfig: [customAI, simpleAI, simpleAI, simpleAI, simpleAI]
}

/******************** NO NEED TO CHANGE ANY CODE BELOW THIS LINE **********************/

const initPlayers = function () {
    const players = simulationConfig.playersConfig.map(player => {
        const playerClone = cloneDeep(player);
        playerClone.id = playerClone.id + (Math.floor(Math.random() * Math.floor(1000)).toString());
        return playerClone;
    });

    return players;
}

const scoreRound = function (roundResult: Array<PlayerRoundState>, gameScore: Array<GameScore>, roundNumber: number) {
    // console.log("scoring round", roundNumber);
    roundResult.forEach(playerResult => {

        // console.log("result to score: ", playerResult)

        let playerInGameScore = gameScore.find(item => item.playerId === playerResult.playerId);

        if (!playerInGameScore) {
            // console.log("did not find player score (first round)")
            playerInGameScore = {
                playerId: playerResult.playerId,
                scores: [],
                total: 0,
                zeroBetWins: 0,
                fullBetWins: 0,
                invalidBets: 0,
                invalidCardPlays: 0,
                plumps: 0
            }

            gameScore.push(playerInGameScore);
        }

        // day of doooom
        if (playerResult.bet === playerResult.setsWon) {
            if (playerResult.isFullBet) {
                playerInGameScore.fullBetWins++;
            }
            else if (playerResult.bet === 0) {
                playerInGameScore.zeroBetWins++;
            }
            const score = playerResult.isFullBet ? playerResult.bet + 20 : playerResult.bet + 10;
            playerInGameScore.scores[roundNumber - 1] = playerResult.bet === 0 ? 5 : score;
        }
        else {
            playerInGameScore.plumps++;
            playerInGameScore.scores[roundNumber - 1] = 0;
        }
        playerInGameScore.invalidBets += playerResult.invalidBet;
        playerInGameScore.invalidCardPlays += playerResult.invalidCardPlayed;

        playerInGameScore.total = playerInGameScore.scores.reduce((a, b) => a + b, 0);
    });
}

const letsPlay = function (players: Array<Player>) {
    // give me some of thos AI's

    // before the game begins select first player at random
    const startingPlayerIndex = Math.floor(Math.random() * Math.floor(players.length));
    players = utils.rotateRight(players, startingPlayerIndex);
    const gameScore = new Array<GameScore>();

    // the game has total of 11 rounds, card number goes from 10-5-10
    for (let i = -7; i < 8; i++) {
        //for (let i = -7; i < -5; i++) {
        const roundNumber = 8 + i;
        const cards = 10 - (7 - Math.abs(i));

        //console.log("card number: " + cards );
        //console.log("round number: " + roundNumber);

        const roundPlayers = [...players];
        const roundResult: Array<PlayerRoundState> = roundManager.initRound(roundPlayers, cards, simulationConfig.debugLogs);

        // rotate the player order to let the next player be first player
        utils.rotateRight(players, 1);
        scoreRound(roundResult, gameScore, roundNumber);
    }

    //console.log(gameScore);
    return gameScore;
}

const startSim = function () {
    const players: Array<Player> = initPlayers();
    const totals = new Array<SimulationScore>();
    players.forEach(player => {
        totals.push({
            playerId: player.id,
            totalScore: 0,
            totalPlumps: 0,
            totalFullSetWins: 0,
            totalZeroBetWins: 0,
            invalidBets: 0,
            invalidCardPlays: 0
        })
    });
    const gamesToSimulate = simulationConfig.gamesToRun;

    for (let i = 0; i < gamesToSimulate; i++) {

        const result = letsPlay(players);

        result.forEach((playerResult: GameScore) => {
            const playerInGameScore = totals.find(item => item.playerId === playerResult.playerId);
            if (playerInGameScore) {
                playerInGameScore.totalScore += playerResult.total;
                playerInGameScore.invalidBets += playerResult.invalidBets;
                playerInGameScore.invalidCardPlays += playerResult.invalidCardPlays;
                playerInGameScore.totalPlumps += playerResult.plumps;
                playerInGameScore.totalZeroBetWins += playerResult.zeroBetWins;
                playerInGameScore.totalFullSetWins += playerResult.fullBetWins;
            }
        });
    }
    //console.log(totals);

    totals.forEach(score => {
        console.log('---' + score.playerId + '---');
        console.log('Plumps per game: ' + score.totalPlumps / gamesToSimulate);
        console.log('Zero bet wins per game: ' + score.totalZeroBetWins / gamesToSimulate);
        console.log('Full bet wins per game: ' + score.totalFullSetWins / gamesToSimulate);
        console.log('Invalid Bets: ' + score.invalidBets);
        console.log('Invalid Card Plays: ' + score.invalidCardPlays);
    });

    console.log('-----------------');


    console.log('---average score per game---');
    totals.forEach(score => {
        console.log(score.playerId + ': ' + score.totalScore / gamesToSimulate);
    });
}();