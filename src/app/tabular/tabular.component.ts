import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabular',
  templateUrl: './tabular.component.html',
  styleUrls: ['./tabular.component.css']
})
export class TabularComponent implements OnInit {
  @Input() weatherInfo: any[] | undefined;
  constructor() { }

  ngOnInit(): void {
  }
  columnDefs = [
    { headerName: 'Key', field: 'key', hide: true },
    {
      headerName: 'Station',
      field: 'stationId',
      sortable: true,
      flex: 1,
      resizable: true,
    },
    {
      headerName: 'Temperature(°C)',
      field: 'temperature',
      sortable: true,
      flex: 1,
      resizable: true,
    },
    {
      headerName: 'Humidity(%)',
      field: 'humidity',
      sortable: true,
      flex: 1,
      resizable: true,
    },
    {
      headerName: 'Datetime',
      field: 'thedatetime',
      sortable: true,
      flex: 1,
      // width: 640,
      resizable: true,
    },
  ];

}
