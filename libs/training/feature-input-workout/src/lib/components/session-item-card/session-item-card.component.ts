import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import {
  SessionItemBoardCardData,
  SessionItemCardOutput,
} from '@bod/training/domain';
import { Subject } from 'rxjs';
import { debounceTime, tap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'training-session-item-card',
  templateUrl: './session-item-card.component.html',
  styleUrls: ['./session-item-card.component.scss'],
})
export class SessionItemCardComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<any> = new Subject();
  private _data: SessionItemBoardCardData;
  @Input()
  get data(): SessionItemBoardCardData {
    return this._data;
  }
  set data(data: SessionItemBoardCardData) {
    this._data = data;
    this.form = this.buildForm(data);
  }
  @Output() save: EventEmitter<SessionItemCardOutput> = new EventEmitter();
  form: FormGroup = this.fb.group({});

  get sets() {
    return <FormArray>this.form.get('sets');
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  /**
   * arrayOfCount is used to turn the amount of sets into an array
   * @param n length of the Array
   */
  arrayOfCount(n: number): any[] {
    return Array(n).fill(null);
  }

  /**
   * buildForm
   * Each time the session item changes the form needs to be reset according to the dictates of the session item
   * and related statistics
   * @param data { SessionItemBoardCardData };
   */
  buildForm(data: SessionItemBoardCardData): FormGroup {
    const rpe = data.sessionItemStatistic && data.sessionItemStatistic.rpe;
    const notes = data.sessionItemStatistic && data.sessionItemStatistic.notes;
    const sets = this.fb.array([]);
    this.arrayOfCount(data.sessionItem.sets).forEach((s, i) => {
      const hasSetStatistic = !!data.setStatistics[i];
      const setReps = hasSetStatistic && data.setStatistics[i].reps;
      const setWeight = hasSetStatistic && data.setStatistics[i].weight;
      const control = this.fb.group({
        set: i + 1,
        reps: this.fb.control(setReps ? setReps : 0),
        weight: this.fb.control(setWeight ? setWeight : 0),
      });
      sets.push(control);
    });
    const form = this.fb.group({
      sets,
      rpe: this.fb.control(rpe ? rpe : 0),
      notes: this.fb.control(notes ? notes : ''),
    });

    form.valueChanges
      .pipe(
        debounceTime(300),
        takeUntil(this.unsubscribe$),
        tap((value) => this.onSave(value))
      )
      .subscribe();
    return form;
  }

  /**
   * onRepsFocus
   * when a rep is focused then set its value to null so that a user can change the number
   * without clearing the previous number
   * @param i { number };
   */
  onRepsFocus(i) {
    this.sets.controls[i].get('reps').setValue(null, { onlySelf: true });
  }

  /**
   * onRepsBlur
   * when a rep is blureed then check if it's still null from the focus handler
   * if its not null then the user input a number and the form will be saved with the latest value
   * @param i { number };
   */
  onRepsBlur(i) {
    const control = this.sets.controls[i].get('reps');

    if (control.value === null) {
      control.setValue(this.data.setStatistics[i].reps, { onlySelf: true });
    }
  }

  onSave(value: {
    rpe: number;
    notes: string;
    sets: {
      id?: number;
      set: number;
      reps: number;
      weight: number;
    }[];
  }) {
    const sessionItemStatisticId = !!this.data.sessionItemStatistic
      ? this.data.sessionItemStatistic.id
      : undefined;
    const output: SessionItemCardOutput = {
      sessionItemStatistic: {
        id: sessionItemStatisticId,
        rpe: value.rpe,
        notes: value.notes,
        sessionItemId: this.data.sessionItem.id,
      },
      setStatistics: value.sets.map((s, i) => ({
        id: this.data.setStatistics[i] && this.data.setStatistics[i].id,
        sessionItemStatisticId,
        ...s,
      })),
    };
    this.save.emit(output);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
