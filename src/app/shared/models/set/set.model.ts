import { Card } from './card.model';
import { Stats } from './stats.model';

export interface Set {
  _id?: string;
  name: string;
  cards: Card[];
  stats: Stats;
  creator: string;
}
