import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { WeatherComponent } from './weather/weather.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HighchartsChartModule } from 'highcharts-angular';
import { AgGridModule } from 'ag-grid-angular';
import { WeatherService } from './weather/weather.service';
import { TabularComponent } from './tabular/tabular.component';

@NgModule({
  declarations: [
    AppComponent,
    WeatherComponent,
    TabularComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgbModule,
    HighchartsChartModule,
    HttpClientModule,
    AgGridModule.withComponents([]),
  ],
  providers: [WeatherService],
  bootstrap: [AppComponent]
})
export class AppModule { }
