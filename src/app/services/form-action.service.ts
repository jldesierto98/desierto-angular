import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { Country } from '../common/country';
import { HttpClient } from '@angular/common/http';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class FormActionService {

  private getCountriesUrl = 'http://localhost:8080/country/all';
  private getStatesUrl = 'http://localhost:8080/state/all';
  private getStatesByCountryIdUrl = 'http://localhost:8080/state/';

  constructor(private httpClient: HttpClient) { }

  getCreditCardMonths(startMonth: number): Observable<number[]>{

    let data: number[] = [];

    for(let theMonth = startMonth; theMonth <= 12; theMonth++){
      data.push(theMonth);
    }

    return of(data);

  }

  getCreditCardYears(): Observable<number[]>{
    let data: number[] = [];

    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for(let theYear = startYear; theYear <= endYear; theYear++){
      data.push(theYear);
    }

    return of(data);
  }

  getCountries(): Observable<Country[]>{
    
    return this.httpClient.get<Country[]>(this.getCountriesUrl);

  }

  getStates(): Observable<State[]> {

    return this.httpClient.get<GetResponseStates>(this.getStatesUrl).pipe(
      map(response => response._embedded.states)
    );

  }

  getStateByCountryId(countryId: number): Observable<State[]> {
    return this.httpClient.post<State[]>(`${this.getStatesByCountryIdUrl}${countryId}`, countryId);
  }


}

interface GetResponseCountries {
    countries: Country[];
}

interface GetResponseStates {
  _embedded: {
    states: State[];
  }
}
