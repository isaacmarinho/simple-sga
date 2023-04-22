import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HOME_ROUTE} from "./home.route";
import {RouterModule} from "@angular/router";
import {HomeComponent} from "./home.component";



@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([HOME_ROUTE])
  ]
})
export class HomeModule { }
