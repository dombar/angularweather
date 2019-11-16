import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class WeatherService {

  constructor(private http: HttpClient) {}

  getCurrentLocation(lat : number,lng: number): Observable<any> {
    return this.http.get(`${environment.googleMapApiUrl}?key=${environment.googleMapApiKey}&latlng=${lat},${lng}&sensor=true`)
    .pipe(map(response => response));
  }

  getCurrentWeather(loc: string) {
    return this.http.get(`${environment.weatherMapApiUrl}/weather?q=${loc}&appid=${environment.weatherMapApiKey}`)
  }

}