import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnvironmentalComponent } from './environmental.component';
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatIconModule} from "@angular/material/icon";
import { EnvironmentalDialogComponent } from './environmental-dialog/environmental-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";



@NgModule({
  declarations: [
    EnvironmentalComponent,
    EnvironmentalDialogComponent
  ],
    imports: [
        CommonModule,
        MatTableModule,
        MatPaginatorModule,
        MatIconModule,
        MatDialogModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        FormsModule,
        MatButtonModule,
        MatTooltipModule,
        MatSelectModule
    ],
    providers:[MatDatepickerModule]
})
export class EnvironmentalModule { }
