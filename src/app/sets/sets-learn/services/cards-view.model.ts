import { Card } from "../../../shared/models/set/card.model";

export interface CardsView {
  active: Card;
  deactive: [Card, Card];
}
