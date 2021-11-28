import { Card } from "./card.model";

export interface Set {
    _id?: string,
    name: string,
    cards: Card[],
    stats: {
        group1: number,
        group2: number,
        group3: number,
        group4: number,
        group5: number,
    },
    creator: string
}