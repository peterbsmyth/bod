import { Injectable } from '@angular/core';
import { SetStatistic } from '@bod/shared/models';
import { Observable } from 'rxjs';
import { environment } from '@bod/shared/environments';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SetStatisticDataService {
  private API_URL = environment.API_URL;

  getAllBySessionItemStatistic(id: number) {
    return this.http.get<SetStatistic[]>(`${this.API_URL}/session-item-statistics/${id}/set-statistic`);
  }

  getAll(): Observable<SetStatistic[]> {
    return this.http.get<SetStatistic[]>(`${this.API_URL}/set-statistics`);
  }

  getOne(id: number): Observable<SetStatistic> {
    return this.http.get<SetStatistic>(`${this.API_URL}/set-statistics/${id}`);
  }

  constructor(
    private http: HttpClient
  ) { }
}
