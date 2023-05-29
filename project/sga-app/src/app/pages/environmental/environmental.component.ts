import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatTableDataSource} from '@angular/material/table';
import {EnvironmentalService} from "../../services/environmental.service";
import {Result} from "../../../../../shared/interfaces/Result";
import {Process} from "../../../../../shared/interfaces/Process";
import {MatDialog} from "@angular/material/dialog";
import {EnvironmentalDialogComponent} from "./environmental-dialog/environmental-dialog.component";
import {Router} from "@angular/router";
import {AuthenticatorService} from "@aws-amplify/ui-angular";

@Component({
  selector: 'app-environmental',
  templateUrl: './environmental.component.html',
  styleUrls: ['./environmental.component.sass']
})
export class EnvironmentalComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['project', 'name', 'status', 'valid_since', 'expiration', 'actions'];
  dataSource = new MatTableDataSource<Process>(new Array<Process>);

  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private router: Router, private authenticator: AuthenticatorService,
              private environmentalService: EnvironmentalService,
              private dialog: MatDialog, private snackBar: MatSnackBar) {
    this.fetchData(null);
  }

  ngOnInit(): void {
    if(this.authenticator.route !== "authenticated"){
      this.router.navigateByUrl("/login").then(r => console.log("Navigate to login"));
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, "Dismiss", {duration: 5000});
  }

  openDialog(action: string, process: Process | null): void {
    const currentProcess = action == "edit"
      ? Object.assign({}, process)
      : {} as Process;
    const dialogRef = this.dialog.open(EnvironmentalDialogComponent, {
      data: {action: action, process: currentProcess},
    });

    dialogRef.afterClosed().subscribe((value: Process) => {
      console.log('The dialog was closed');
      console.log(value);
      if (!!value) {
        if (action == "edit" && !!process) {
          this.updateProcess(process._id, this.getProcessDiff(process, value));
        } else {
          this.addProcess(value);
        }
      }
    });
  }

  getProcessDiff(original: Process, changed: Process): Object {
    const partialProcess: { [key: string]: string } = {};
    Object.keys(changed).forEach((key: string, index: number) => {
      if (Object.values(changed)[index] != Object.values(original)[index]) {
        partialProcess[key] = Object.values(changed)[index];
      }
    });
    return partialProcess;
  }


  fetchData(event?: PageEvent | null) {
    console.log(event);
    let that = this;
    this.environmentalService.fetchProcess(event?.pageIndex || 0, event?.pageSize || 5).then((result) => {
      if (!!result) {
        result?.subscribe(value => {
          if (!!value) {
            console.log((value as Result).data.data);
            that.dataSource = (value as Result).data.data;
            this.dataSource = (value as Result).data.data;
            this.paginator.pageSize = (value as Result).data.rowsPerPage;
            this.paginator.length = (value as Result).data.count;
            this.paginator.pageIndex = (value as Result).data.pageNumber;
          }
        });
      }
    });
  }

  removeProcess(process: Process) {
    this.environmentalService.deleteProcess(process._id).then((result) => {
      if (!!result) {
        result?.subscribe(value => {
          const pageEvent: PageEvent = this.paginator;
          this.openSnackBar("Successfully removed!");
          this.fetchData(pageEvent);
        });
      }
    });
  }

  addProcess(process: Process) {
    this.environmentalService.createProcess(process).then((result) => {
      if (!!result) {
        result?.subscribe(value => {
          const pageEvent: PageEvent = this.paginator;
          this.openSnackBar("Successfully created!");
          this.fetchData(pageEvent);
        });
      }
    });
  }

  updateProcess(id: string, process: Partial<Process>) {
    this.environmentalService.updateProcess(id, process).then((result) => {
      if (!!result) {
        result?.subscribe(value => {
          const pageEvent: PageEvent = this.paginator;
          this.openSnackBar("Successfully modified!");
          this.fetchData(pageEvent);
        });
      }
    });
  }

  getDueDate(process: Process) {
    const dueDate = new Date(process.valid_since);
    console.log("DUE DATE: {}", dueDate);
    dueDate.setFullYear(dueDate.getFullYear() + (process.expiration || 0));
    console.log("DUE DATE: {}", dueDate);
    return dueDate;
  }
}
