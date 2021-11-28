import { Component } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { Set } from 'src/app/shared/models/set.model';
import { SetsService } from '../sets.service';

@Component({
  selector: 'app-sets-create',
  templateUrl: './sets-create.component.html',
  styleUrls: ['./sets-create.component.scss'],
})
export class SetsCreateComponent {
  setsCreateForm = this.fb.group({
    name: ['', Validators.required],
    cards: this.fb.array([]),
  });

  constructor(private fb: FormBuilder, private setsService: SetsService) {
    this.addCard();
    console.log(this.setsCreateForm.get('cards'));
  }

  addCard() {
    const newCardGroup = this.fb.group({
      concept: ['', Validators.required],
      definition: ['', Validators.required],
      group: [1, Validators.required],
      example: ['']
    });

    this.cards.push(newCardGroup);
  }

  get cards() {
    return this.setsCreateForm.get('cards') as FormArray;
  }

  onSubmit() {
    const newSet: Set = this.setsCreateForm.value;
    newSet.stats = {
      group1: newSet.cards.length,
      group2: 0,
      group3: 0,
      group4: 0,
      group5: 0,
    }
    this.setsService.addSet(newSet).subscribe();
  }
}
