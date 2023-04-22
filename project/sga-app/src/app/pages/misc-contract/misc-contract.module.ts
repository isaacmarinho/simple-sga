import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiscContractComponent } from './misc-contract.component';
import {RouterModule} from "@angular/router";
import {MISC_CONTRACT_ROUTE} from "./misc-contract.route";



@NgModule({
  declarations: [
    MiscContractComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([MISC_CONTRACT_ROUTE])
  ]
})
export class MiscContractModule { }
