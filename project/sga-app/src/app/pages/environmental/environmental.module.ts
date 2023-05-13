import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnvironmentalComponent } from './environmental.component';
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";



@NgModule({
  declarations: [
    EnvironmentalComponent
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule
  ]
})
export class EnvironmentalModule { }
