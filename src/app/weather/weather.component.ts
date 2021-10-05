import { HumidityObj } from './../interface/humidityobj';
import { TemperatureObj } from './../interface/temperatureobj';
import { WeatherService } from './weather.service';
import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts/highstock';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {
  constructor(private service: WeatherService) { }
  ngOnInit() { }
  title = "How's Weather?";
  //To get value from the input and select
  inputedDate: string | undefined;
  selectedOption: string | undefined;

  onStation: string | String | undefined;

  //get today's time
  onToday = formatDate(new Date(), 'yyyy-MM-dd', 'en');
  oneDay = 24 * 60 * 60 * 1000;
  // to store the date of 30 days
  dateSeries: string[] = [];
  //to store the information about weather, temperature, humidity
  weatherInfo: any[] = [];
  temperatureInfo: TemperatureObj[] = [];
  humidityInfo: HumidityObj[] = [];
  //to store the data for plot as [key,value].
  temperaturePlot: any[] = [];
  humidityPlot: any[] = [];
  // define the select options
  selectOptions = [
    { name: 'S24', value: 'S24' },
    { name: 'S43', value: 'S43' },
    { name: 'S44', value: 'S44' },
    { name: 'S50', value: 'S50' },
    { name: 'S100', value: 'S100' },
    { name: 'S104', value: 'S104' },
    { name: 'S106', value: 'S106' },
    { name: 'S107', value: 'S107' },
    { name: 'S108', value: 'S108' },
    { name: 'S109', value: 'S109' },
    { name: 'S111', value: 'S111' },
    { name: 'S115', value: 'S115' },
    { name: 'S116', value: 'S116' },
    { name: 'S121', value: 'S121' },
  ];
  // define the highchar option
  Highcharts: typeof Highcharts = Highcharts;
  updateFlag = false;
  chartOptions: Highcharts.Options = {
    title: {
      text: 'Temprature and Humidity',
    },
    xAxis: {
      type: 'datetime',
      title: {
        text: 'Time',
      },
    },
    yAxis: {
      title: {
        text: 'Meansurement',
      },
    },
    series: [
      {
        name: 'Temperature',
        type: 'spline',
        pointInterval: 24 * 3600 * 1000,
        data: this.temperaturePlot,
        tooltip: { valueSuffix: '°C' },
      },
      {
        name: 'Humidity',
        data: this.humidityPlot,
        type: 'spline',
        tooltip: { valueSuffix: '%' },
      },
    ],
  };

  // to get the data from the input field and get access to the api
  // this will check if the date and the station id is empty or not
  // return nothing if the one of the value is empty
  getDateVal() {
    this.inputedDate;
    if (
      this.inputedDate == undefined ||
      this.selectedOption == undefined ||
      Date.parse(this.inputedDate) > Date.parse(this.onToday)
    ) {
      alert('Please enter the vaild station id or the date before today');
      return false;
    }
    this.onStation = this.selectedOption;
    this.clearData();

    // get 30 days, used unshift to add new date at the front of the array
    const dateSecond: number[] = [];
    dateSecond.push(Date.parse(this.inputedDate));
    this.dateSeries.push(this.inputedDate);
    for (let day = 1; day < 3; day++) {
      const prevDate = dateSecond[0];
      this.dateSeries.unshift(
        formatDate(new Date(prevDate - this.oneDay), 'yyyy-MM-dd', 'en')
      );
      dateSecond.unshift(prevDate - this.oneDay);
    }
    // get the date from dateSeries and save it to the array
    for (let theDate = 0; theDate < 3; theDate++) {
      this.service
        .getAirTemperature(this.dateSeries[theDate], this.onStation)
        .toPromise()
        .then((response) => {
          this.temperatureInfo = [...this.temperatureInfo, ...response];
          // console.log( response);
        });
      this.service
        .getRelativeHumidity(this.dateSeries[theDate], this.onStation)
        .toPromise()
        .then((response) => {
          this.humidityInfo = [...this.humidityInfo, ...response];
          // console.log( response);
        });
    }
    this.mergeTemperatureHumidity();
    this.plotTemperatureHumidity();
    this.handleUpdate();
    return true;
  }

  clearData() {
    this.weatherInfo.splice(0, this.weatherInfo.length);
    this.temperatureInfo.splice(0, this.weatherInfo.length);
    this.humidityInfo.splice(0, this.weatherInfo.length);
    this.temperaturePlot.splice(0, this.temperaturePlot.length);
    this.humidityPlot.splice(0, this.humidityPlot.length);
    this.dateSeries.splice(0, this.dateSeries.length);
  }

  mergeTemperatureHumidity() {
    this.weatherInfo = this.temperatureInfo.map((subject) => {
      let otherSubject = this.humidityInfo.find(
        (element) => element.key === subject.key
      );
      return {
        ...subject,
        ...otherSubject,
      };
    });
  }

  plotTemperatureHumidity() {
    for (let i = 0; i < this.weatherInfo.length; i++) {
      const dataStr = this.weatherInfo[i].thedatetime;
      const dates: number = Date.parse(dataStr);
      this.temperaturePlot.push([dates, this.weatherInfo[i].temperature]);
      this.humidityPlot.push([dates, this.weatherInfo[i].humidity]);
    }
    this.temperaturePlot = this.temperaturePlot.sort(function (a, b) {
      return a[0] - b[0];
    });
    this.humidityPlot = this.humidityPlot.sort(function (a, b) {
      return a[0] - b[0];
    });
  }

  // handle the highchats when there is a updat on data
  handleUpdate() {
    this.chartOptions.title = {
      text: 'Temperature and Humidity at ' + this.onStation,
    };
    this.chartOptions.series=[
        {
          name: 'Temperature',
          type: 'spline',
          pointInterval: 24 * 3600 * 1000,
          data: this.temperaturePlot,
          tooltip: { valueSuffix: '°C' },
        },
        {
          name: 'Humidity',
          data: this.humidityPlot,
          type: 'spline',
          tooltip: { valueSuffix: '%' },
        },
    ]

  
  //   this.chartOptions.series ? = {
  //     {
  //     name: 'Temperature',
  //       type: 'spline',
  //         pointInterval: 24 * 3600 * 1000,
  //           data: this.temperaturePlot,
  //             tooltip: {
  //       valueDecimals: 2,
  //         valueSuffix: '°C',
  //     },
  //   },
  //   {
  //     name: 'Humidity',
  //       type: 'spline',
  //         data: this.humidityPlot,
  //           pointInterval: 24 * 3600 * 1000,
  //             tooltip: { valueDecimals: 2, valueSuffix: '%' },
  //   }
  // };
  
    this.updateFlag = true;
  }
}

