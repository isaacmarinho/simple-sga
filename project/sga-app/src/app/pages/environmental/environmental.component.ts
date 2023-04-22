import {Component, OnInit} from '@angular/core';
import {EnvironmentalService} from "../../services/environmental.service";

@Component({
  selector: 'app-environmental',
  templateUrl: './environmental.component.html',
  styleUrls: ['./environmental.component.sass']
})
export class EnvironmentalComponent implements OnInit {

  constructor(private environmentalService: EnvironmentalService) {

  }

  ngOnInit(): void {
  }

}
