import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {EnvironmentalService} from "../../services/environmental.service";
import {Result} from "../../../../../shared/interfaces/Result";
import {Process} from "../../../../../shared/interfaces/Process";

@Component({
  selector: 'app-environmental',
  templateUrl: './environmental.component.html',
  styleUrls: ['./environmental.component.sass']
})
export class EnvironmentalComponent implements AfterViewInit {
  displayedColumns: string[] = ['project', 'name', 'status', 'valid_since', 'expiration', 'actions'];
  dataSource = new MatTableDataSource<Process>(new Array<Process>);

  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(private environmentalService: EnvironmentalService) {
    this.fetchData(null);
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
          this.fetchData(pageEvent);
        });
      }
    });
  }

  getDueDate(process: Process) {
    const dueDate = new Date(process.valid_since);
    dueDate.setFullYear(dueDate.getFullYear() + process.expiration);
    return dueDate;
  }
}
