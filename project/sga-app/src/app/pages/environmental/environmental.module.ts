import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnvironmentalComponent } from './environmental.component';
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatIconModule} from "@angular/material/icon";



@NgModule({
  declarations: [
    EnvironmentalComponent
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule
  ]
})
export class EnvironmentalModule { }
