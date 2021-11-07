import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Set } from 'src/app/shared/models/set.model';
import { SetsService } from '../sets.service';

@Component({
  selector: 'app-sets-learn',
  templateUrl: './sets-learn.component.html',
  styleUrls: ['./sets-learn.component.scss']
})
export class SetsLearnComponent implements OnInit {
  set!: Set;

  constructor(private route: ActivatedRoute, private setsService: SetsService) { }

  ngOnInit() {
    const id = this.route.snapshot.params.setId;
    this.setsService.getSet(id).subscribe(set => {
      this.set = set;
    })
  }
}
