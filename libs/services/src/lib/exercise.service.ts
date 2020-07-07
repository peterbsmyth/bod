import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { mockExercises, Exercise } from '@bod/models';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {
  private _sourceList: Exercise[] = mockExercises;

  private _sourceList$: BehaviorSubject<Exercise[]> = new BehaviorSubject(this._sourceList);
  
  get sourceList$(): Observable<Exercise[]> {
    return this._sourceList$.asObservable();
  }
  constructor() { }

  save(exercise: Exercise) {
    const id = this._sourceList[this._sourceList.length -1].id + 1;
    this._sourceList.push({
      id,
      ...exercise
    });
    this._sourceList$.next(this._sourceList);
  }
}