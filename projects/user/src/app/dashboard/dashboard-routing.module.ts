import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { UserGuard } from '../core/core.module/guards/user.guard';

/* Default routing to Layout component  */
/* Check Guard if true you can access to Paths is false navigate to Login Page */

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        canActivateChild: [UserGuard],
        children: [{
            path: '',
            loadChildren: () => import(`./tasks/tasks.module`).then(m => m.TasksModule)
        }]
    },


];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardRoutingModule { }