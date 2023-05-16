import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {Process} from "../../../../../../shared/interfaces/Process";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";

export const MY_FORMATS = {
  display: {
    dateInput: 'DD/MM/YYYY',
  },
};

export interface Licence {
  code: string;
  name: string;
}

const LICENCES: Licence[] = [
  {code: "LP", name: "Licença Prévia"},
  {code: "LI", name: "Licença de Instalação"},
  {code: "LO", name: "Licença de Operação"},
]

@Component({
  selector: 'app-environmental-dialog',
  templateUrl: './environmental-dialog.component.html',
  styleUrls: ['./environmental-dialog.component.sass'],
  providers: [{
    provide: DateAdapter,
    useClass: MomentDateAdapter,
    deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
  },
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}]
})
export class EnvironmentalDialogComponent implements OnInit {
  constructor(
    private _adapter: DateAdapter<any>,
    public dialogRef: MatDialogRef<EnvironmentalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { action: string, process: Process },
  ) {
  }

  onCancelClick(): void {
    console.log("Action canceled!");
    this.dialogRef.close();
  }

  capitalizeFirstLetter(str: string): string {
    return str.replace(/^\w/, (c) => c.toUpperCase());
  }

  ngOnInit(): void {
    if (!this.data.process) {
      this.data.process = <Process>{valid_since: new Date(), expiration: 5};
    } else {

      if (!this.data.process.valid_since) {
        this.data.process.valid_since = new Date();
      }

      if (!this.data.process.expiration) {
        this.data.process.expiration = 5;
      }

      if (!this.data.process.status) {
        this.data.process.status = "LP";
      }

    }
  }

  protected readonly LICENCES = LICENCES;
}
