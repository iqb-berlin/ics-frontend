import { Routes } from '@angular/router';
import { TaskComponent } from './components/task/task.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { StartComponent } from './components/start/start.component';
import { CodersComponent } from './components/coders/coders.component';

export const routes: Routes = [
  { path: 'task/:id', component: TaskComponent },
  { path: 'tasks', component: TasksComponent },
  { path: 'coders', component: CodersComponent },
  { path: '', component: StartComponent },
  { path: 'start', component: StartComponent },
];
