import { Component, OnInit } from '@angular/core';
import { SetsService } from '../sets.service';

@Component({
  selector: 'app-sets-panel',
  templateUrl: './sets-panel.component.html',
  styleUrls: ['./sets-panel.component.scss']
})
export class SetsPanelComponent implements OnInit {
  sets: any;
  constructor(private setsService: SetsService) { }

  ngOnInit(): void {
    this.setsService.getSetsPanelData().subscribe(res => {
      console.log(res);
    })
  }

}
