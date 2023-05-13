import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {EnvironmentalService} from "../../services/environmental.service";
import * as Process from "process";

@Component({
  selector: 'app-environmental',
  templateUrl: './environmental.component.html',
  styleUrls: ['./environmental.component.sass']
})
export class EnvironmentalComponent implements AfterViewInit {
  displayedColumns: string[] = ['project', 'name', 'status', 'valid_since', 'expiration'];
  dataSource = new MatTableDataSource<Process>(ELEMENT_DATA);

  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  // constructor(private environmentalService: EnvironmentalService) {
  //
  // }

  getDueDate(process: Process) {
    const dueDate = new Date(process.valid_since);
    dueDate.setFullYear(dueDate.getFullYear() + process.expiration);
    return dueDate;
  }
}

export interface Process {
  project: string;
  name: string;
  status: string;
  valid_since: Date;
  expiration: number;
}

const ELEMENT_DATA: Process[] = [
  {project: "TEST01", name: "TEST", status: "LP", valid_since: new Date(), expiration: 1},
  {project: "TEST02", name: "TEST 2", status: "LP", valid_since: new Date(), expiration: 2},
  {project: "TEST03", name: "TEST 3", status: "LP", valid_since: new Date(), expiration: 5},
  {project: "TEST01", name: "TEST 10", status: "LP", valid_since: new Date(), expiration: 10},
  {project: "TEST02", name: "TEST 20", status: "LP", valid_since: new Date(), expiration: 20},
  {project: "TEST03", name: "TEST 30", status: "LP", valid_since: new Date(), expiration: 30},
];
