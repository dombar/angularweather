import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { WeatherService } from '../weather.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-current-weather',
  templateUrl: './local-weather.component.html',
  styleUrls: ['./local-weather.component.css'],
  providers: [DatePipe]
})

export class LocalWeatherComponent implements OnInit {
  loc$: Observable<string>;
  loc: string;
  currentWeather: any = <any>{};
  msg: string;
  localDate = new Date();
  localDateString: string;

  constructor(
    private weatherService: WeatherService,
    private datePipe: DatePipe
  ) { 
    this.getCurrentLocation(); 
    this.localDateString = this.datePipe.transform(this.localDate, 'dd-MM-yyyy');
  }

  ngOnInit() {

  }

  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        let current = this.weatherService.getCurrentLocation(position.coords.latitude, position.coords.longitude);
        current.forEach(x => {
          x.results.forEach(k => {
            k.address_components.forEach(a => {
              a.types.forEach(t => {
                if (t === 'administrative_area_level_2') {
                  this.searchWeather(a.long_name);
                }
              })
            })
          })
        });
      });
    }
  }

  search(searchForm: any, event: Event) {
    event.preventDefault();
    this.searchWeather(searchForm);
  }

  searchWeather(loc: string) {
    this.msg = '';
    this.currentWeather = {};
    this.weatherService.getCurrentWeather(loc)
      .subscribe(res => {
        this.currentWeather = res;
      }, err => {
        if (err.error && err.error.message) {
          alert(err.error.message);
          this.msg = err.error.message;
          return;
        }
        alert('Failed to get weather.');
      }, () => {
      })
  }

  resultFound() {
    return Object.keys(this.currentWeather).length > 0;
  }


}