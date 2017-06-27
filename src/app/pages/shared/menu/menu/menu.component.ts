import { ConstructionService } from 'app/pages/construction/construction.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html'
})
export class MenuComponent implements OnInit {
  constructionStatus: string;
  constructor(
    private constructionService: ConstructionService) {
  }
  ngOnInit() {
  }
}
