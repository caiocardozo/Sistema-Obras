import { ConstructionService } from './../construction.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";
import { Location } from '@angular/common';

import { Subscription } from "rxjs/Subscription";
import { Construction } from "./../../construction/construction";


@Component({
  selector: 'app-details-construction',
  templateUrl: './details-construction.component.html',
  styleUrls: ['./details-construction.component.css']
})
export class DetailsConstructionComponent implements OnInit {
  private sub: Subscription;
  constructionId: string = "";
  public construction: Construction;

  constructor(
    private constructionService: ConstructionService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer) {
    this.construction = new Construction();
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(
      params => {
        this.constructionId = params['id'];
      });

    this.constructionService.getConstruction(this.constructionId)
      .subscribe(
      construction => {
        this.construction = construction
      },
      response => {
        if (response.status == 404) {
          this.router.navigate(['NotFound']);
        }
      });
  }

  goBack(): void {
    this.location.back();
  }
}
