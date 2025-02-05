import { Routes } from '@angular/router';
import { TaskComponent } from './components/task/task.component';
import { TasksComponent } from './components/tasks/tasks.component';

export const routes: Routes = [
  { path: 'task/:id', component: TaskComponent },
  { path: 'tasks', component: TasksComponent },
];
