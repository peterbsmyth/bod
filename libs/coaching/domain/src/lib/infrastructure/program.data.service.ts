import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Week, Program, mockProgram } from '@bod/shared/models';
import { Subject, Observable, ReplaySubject } from 'rxjs';
import { environment } from '@bod/shared/environments';

@Injectable()
export class ProgramDataService {
  private API_URL = environment.API_URL;
  private _program: Program = mockProgram;
  private _program$: Subject<Program> = new ReplaySubject(1);
  get program$(): Observable<Program> { return this._program$.asObservable(); }
  constructor(
    private http: HttpClient
  ) {
    this._program$.next(this._program);
  }

  getAll(): Observable<Program[]> {
    return this.http.get<Program[]>(`${this.API_URL}/programs`);
  }

  getOne(id: number): Observable<Program> {
    return this.http.get<Program>(`${this.API_URL}/programs/${id}`);
  }

  saveOne(program: Program) {
    return this.http.post<Program>(`${this.API_URL}/programs`, program);
  }
}
