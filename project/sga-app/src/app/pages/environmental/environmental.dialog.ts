import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Process} from "../../../../../shared/interfaces/Process";

@Component({
  selector: 'environmental-dialog',
  templateUrl: 'environmental.dialog.html',
})
export class EnvironmentalDialog {
  constructor(
    public dialogRef: MatDialogRef<EnvironmentalDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { action: string, process: Process },
  ) {
  }

  onCancelClick(): void {
    console.log("Action canceled!");
    this.dialogRef.close();
  }
}
