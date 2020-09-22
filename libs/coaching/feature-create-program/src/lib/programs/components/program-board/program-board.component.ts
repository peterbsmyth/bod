import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  CdkDrag,
  CdkDropList,
  CdkDragDrop,
  moveItemInArray,
  copyArrayItem,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { remove } from 'lodash-es';
import { ProgramBoardData } from '@bod/coaching/domain';
import { BoardCardData } from '@bod/shared/models';

@Component({
  selector: 'coaching-program-board',
  templateUrl: './program-board.component.html',
  styleUrls: ['./program-board.component.scss'],
})
export class ProgramBoardComponent implements OnInit {
  @Input() displaySource = true;
  private _data: ProgramBoardData;
  @Input()
  get data(): ProgramBoardData {
    return this._data;
  }
  set data(data: ProgramBoardData) {
    this._data = data;
    this.buildBoard(data);
  }
  @Output() update: EventEmitter<any> = new EventEmitter();
  public pullList: BoardCardData[] = [];
  public pushList: BoardCardData[] = [];

  public dayOneList: BoardCardData[] = [];
  public dayTwoList: BoardCardData[] = [];
  public dayThreeList: BoardCardData[] = [];
  public dayFourList: BoardCardData[] = [];

  constructor() {}

  ngOnInit(): void {}

  drop(event: CdkDragDrop<BoardCardData[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else if (
      event.previousContainer.id === 'pushes' ||
      event.previousContainer.id === 'pulls'
    ) {
      copyArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    this.update.emit([
      [...this.dayOneList],
      [...this.dayTwoList],
      [...this.dayThreeList],
      [...this.dayFourList],
    ]);
  }

  uniquePredicate = (item: CdkDrag<BoardCardData>, list: CdkDropList) => {
    const arrayName = `${list.id}List`;
    const array: BoardCardData[] = this[arrayName];
    const arrayIncludesExercise = array.find(
      (e) => e.exercise.id === item.data.exercise.id
    );

    if (arrayIncludesExercise) {
      return false;
    } else {
      return true;
    }
  };

  onRemove(datum, list: string) {
    remove(this[list], { exercise: { id: datum.exercise.id } });

    this.update.emit([
      [...this.dayOneList],
      [...this.dayTwoList],
      [...this.dayThreeList],
      [...this.dayFourList],
    ]);
  }

  buildBoard(data: ProgramBoardData) {
    const hasData = data && data.sessionItems && data.exercises.length;
    if (hasData && !this.displaySource) {
      const allBoardCardData = data.sessionItems.map((sessionItem) => {
        return {
          sessionItem: {
            ...sessionItem,
          },
          exercise: data.exercises.find(
            (exercise) => sessionItem.exerciseId === exercise.id
          ),
        };
      });

      const session1 = data.sessions.find((session) => session.order === 1);
      const session2 = data.sessions.find((session) => session.order === 2);
      const session3 = data.sessions.find((session) => session.order === 3);
      const session4 = data.sessions.find((session) => session.order === 4);
      this.dayOneList = allBoardCardData.filter(
        (datum) => datum.sessionItem.sessionId === session1.id
      );
      this.dayTwoList = allBoardCardData.filter(
        (datum) => datum.sessionItem.sessionId === session2.id
      );
      this.dayThreeList = allBoardCardData.filter(
        (datum) => datum.sessionItem.sessionId === session3.id
      );
      this.dayFourList = allBoardCardData.filter(
        (datum) => datum.sessionItem.sessionId === session4.id
      );
    }

    if (hasData && this.displaySource) {
      this.pullList = data.exercises
        .filter((e) => e.pull)
        .map((exercise) => ({ sessionItem: null, exercise }))
        .sort((a, b) => a.exercise.name.localeCompare(b.exercise.name));
      this.pushList = data.exercises
        .filter((e) => e.push)
        .map((exercise) => ({ sessionItem: null, exercise }))
        .sort((a, b) => a.exercise.name.localeCompare(b.exercise.name));
    }
  }
}