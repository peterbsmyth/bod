import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreatePage } from './pages/create/create.page';
import { ExercisePage } from './pages/exercise/exercise.page';
import { ExercisesPage } from './pages/exercises/exercises.page';
import { ExerciseExistsGuard } from './exercise-exists.guard';

const routes: Routes = [
  { path: 'exercises', component: ExercisesPage },
  { path: 'exercises/create', component: CreatePage },
  {
    path: 'exercises/:exerciseId',
    component: ExercisePage,
    canActivate: [ExerciseExistsGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExercisesRoutingModule {}