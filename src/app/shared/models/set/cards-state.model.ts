import { CardsView } from "../../../sets/sets-learn/services/cards-view.model";

export interface CardsState {
    cardsLength: number;
    cardIndex: number;
    cardsView: CardsView;
}