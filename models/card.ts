export const suits = ["spades", "diamonds", "clubs", "hearts"];
export const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

export type Card = {
    value: string,
    suit: string,
    key: string
}