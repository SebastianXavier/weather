import { TemperatureObj } from './../interface/temperatureobj';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { WeatherComponent } from './weather.component';
import { WeatherService } from './weather.service';
// import { getDateVal } from'./weather.component'

describe('WeatherComponent', () => {
  let component: WeatherComponent;
  let fixture: ComponentFixture<WeatherComponent>;
  let service: WeatherService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ WeatherComponent ],
      providers : [WeatherService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    const spy = jasmine.createSpyObj('HttpClient', { post: of({}), get: of({}) })
    service = new WeatherService(spy)
    
    fixture = TestBed.createComponent(WeatherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should return obj',()=>{
    let theDate = new Date('2021-09-30')
    let temperature:TemperatureObj[] = [
      {'key': 'S1002021','stationId':'S100','temperature':26,'thedatetime':theDate}
    ]
    spyOn(service, 'getAirTemperature').and.returnValue(of(temperature));
    expect(component.getDateVal).toBeTruthy();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
