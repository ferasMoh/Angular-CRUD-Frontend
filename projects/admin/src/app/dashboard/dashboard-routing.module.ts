import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { AdminGuard } from '../core/guards/admin.guard';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';

/* Default routing to Layout component  */
/* Check Guard if true you can access to Paths is false navigate to Login Page */

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivateChild: [AdminGuard],
    children: [
      {
        path: 'tasks',
        loadChildren: () => import(`./tasks-admin/tasks-admin.module`).then(m => m.TasksAdminModule)
      },
      {
        path: 'users',
        loadChildren: () => import(`./manage-users/manage-users.module`).then(m => m.ManageUsersModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
