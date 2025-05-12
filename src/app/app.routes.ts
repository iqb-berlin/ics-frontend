import { Routes } from '@angular/router';
import { TaskComponent } from './components/task/task.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { StartComponent } from './components/start/start.component';
import { CodersComponent } from './components/coders/coders.component';

export const routes: Routes = [
  { data: { id: 'task' }, path: 'task/:id', component: TaskComponent },
  { data: { id: 'tasks' }, path: 'tasks', component: TasksComponent },
  { data: { id: 'coders' }, path: 'coders', component: CodersComponent },
  { data: { id: 'start' }, path: '', component: StartComponent },
  { data: { id: 'start' }, path: 'start', component: StartComponent }
];
