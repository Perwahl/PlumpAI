import { Card } from './models/card';
import { suits, values } from './models/card';

export const getDeck = function ()
{
	var deck = new Array();

	for(var i = 0; i < suits.length; i++)
	{
		for(var x = 0; x < values.length; x++)
		{
			var card = {value: values[x], suit: suits[i], key: suits[i]+values[x]};
			deck.push(card);
		}
	}

	return deck;
}

export function shuffleDeck(deck:Array<Card>)
{
	// for 1000 turns
	// switch the values of two random cards
	for (var i = 0; i < 1000; i++)
	{
		var location1 = Math.floor((Math.random() * deck.length));
		var location2 = Math.floor((Math.random() * deck.length));
		var tmp = deck[location1];

		deck[location1] = deck[location2];
		deck[location2] = tmp;
	}
}