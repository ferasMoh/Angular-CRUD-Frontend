import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { UsersService, changeStatus } from '../../services/users.service';
import { TasksService } from '../../../tasks-admin/services/tasks.service';
import { ConfirmationComponent } from '../../../confirmation/confirmation.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  displayedColumns: string[] = ['position', 'name', 'email', 'tasksAssigned', 'actions'];
  dataSource: any = [];
  page: any = 1;
  totalItems: any;
  timeoutId:any;
  filteration:any = { page:this.page, limit:10 ,name:'' };
  empty:any = '';

  constructor(
    private service: UsersService,
    private serviceTasks: TasksService,
    private toastr: ToastrService,
    private translate: TranslateService,
    public matDialog: MatDialog,
    private router: Router) {
    this.getUsersFromBehaviorSubject();
  }

  ngOnInit(): void {
     this.service.getUsersData(this.filteration);

  }

  search(event:any) {
    this.filteration.name = event.value;
    this.filteration.page = 1;
    this.page = 1;
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
       this.service.getUsersData(this.filteration);

    }, 500);

  }

  changePage(event: any) {
    this.page = event;
    this.filteration['page'] = event;
     this.service.getUsersData(this.filteration);

  }


  getUsersFromBehaviorSubject() {
    this.service.userData.subscribe((res: any) => {
      this.dataSource = res.data;
      this.totalItems = res.totalItems;
    })
  }

  deleteUser(id: string, index: number) {
    this.serviceTasks.messageConfirm = this.translate.instant('confirmation.message-delete-user');
    const dialogRef = this.matDialog.open(ConfirmationComponent, {
      width: '650px',
    })
    dialogRef.afterClosed().subscribe((res: any) => {
      if (this.serviceTasks.dialogConfirm == 'yes') {
        if (this.dataSource[index].assignedTasks > 0) {
          this.toastr.error(this.translate.instant('toastr.error-delete-user'))
        } else {
          this.service.deleteUser(id).subscribe((res: any) => {
            this.page = 1;
            this.toastr.success(this.translate.instant('toastr.success-delete-user'))
            this.serviceTasks.dialogConfirm == 'no'
             this.service.getUsersData(this.filteration);

          })
        }
      }
    })

  }

  changeUserStatus(status:any, id:string, index:number) {
    if (this.dataSource[index].assignedTasks > 0) {
      this.toastr.error(this.translate.instant('toastr.error-change-user-status'))
    } else {
      const model: changeStatus = {
        id: id,
        status: status
      }
      this.service.changeStatus(model).subscribe((res: any) => {
        this.page = 1;
        this.toastr.success(this.translate.instant('toastr.success-change-user-status'))
         this.service.getUsersData(this.filteration);

      })
    }
  }

}
