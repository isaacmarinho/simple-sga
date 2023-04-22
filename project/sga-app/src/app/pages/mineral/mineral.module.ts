import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MineralComponent} from './mineral.component';
import {RouterModule} from "@angular/router";
import {MINERAL_ROUTE} from "./mineral.route";


@NgModule({
  declarations: [
    MineralComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([MINERAL_ROUTE])
  ]
})
export class MineralModule {
}
