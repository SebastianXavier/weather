import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError,map } from 'rxjs/operators';
import { HumidityObj } from '../interface/humidityobj';
import { TemperatureObj } from '../interface/temperatureobj';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private weatherurl = 'https://api.data.gov.sg/v1/environment';

  options: any;
  constructor(private http: HttpClient) {
    this.options = {
      headers: new HttpHeaders({
        'content-type': 'application/json',
      }),
      observe: 'body' as const,
      responseType: 'json' as const,
    };
  }

  getAirTemperature(
    onDate: String,
    onStationId: String
  ): Observable<TemperatureObj[]> {
    const url = `${this.weatherurl}/air-temperature/?date=${onDate}`;
    //console.warn('Get the temperature data with http request on ' + onDate);
    //return this.data;
    return this.http.get<TemperatureObj>(url).pipe(
      catchError(this.handleError),
      map((res: any) => this.mapResultTemperature(res, onStationId))
    );
  }

  getRelativeHumidity(
    onDate: String,
    onStationId: String
  ): Observable<HumidityObj[]> {
    const url = `${this.weatherurl}/relative-humidity/?date=${onDate}`;
    //console.warn('Get the humidity data with http request on ' + onDate);
    //return this.data;
    return this.http.get<HumidityObj[]>(url).pipe(
      catchError(this.handleError),
      map((res: any) => this.mapResultHumidity(res, onStationId))
    );
  }
  private mapResultTemperature(res: { items: string | any[]; }, onStationId: String): TemperatureObj[] {
    const weatherArray: TemperatureObj[] = [];

    for (let i = 0; i < res.items.length; i += 1) {
      for (let j = 0; j < res.items[i].readings.length; j++) {
        if (res.items[i].readings[j].station_id == onStationId) {
          weatherArray.push({
            key: res.items[i].readings[j].station_id + res.items[i].timestamp,
            stationId: res.items[i].readings[j].station_id,
            temperature: res.items[i].readings[j].value,
            thedatetime: res.items[i].timestamp,
          });
        }
      }
    }

    weatherArray.sort((a, b) => a.stationId.localeCompare(b.stationId));
    return weatherArray;
  }

  private mapResultHumidity(res: { items: string | any[]; }, onStationId: String): HumidityObj[] {
    const weatherArray: HumidityObj[] = [];

    for (let i = 0; i < res.items.length; i += 1) {
      for (let j = 0; j < res.items[i].readings.length; j++) {
        if (res.items[i].readings[j].station_id == onStationId) {
          weatherArray.push({
            key: res.items[i].readings[j].station_id + res.items[i].timestamp,
            stationId: res.items[i].readings[j].station_id,
            humidity: res.items[i].readings[j].value,
            thedatetime: res.items[i].timestamp,
          });
        }
      }
    }
    // weatherArray.sort((a, b) => a.stationId.localeCompare(b.stationId));
    return weatherArray;
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // Return an observable with a user-facing error message.
    return throwError('Something bad happened; please try again later.');
  }
}
