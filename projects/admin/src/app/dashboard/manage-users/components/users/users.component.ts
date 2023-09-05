import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { UsersService, changeStatus } from '../../services/users.service';
import { TasksService } from '../../../tasks-admin/services/tasks.service';
import { ConfirmationComponent } from '../../../confirmation/confirmation.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort

  displayedColumns: string[] = ['id', 'username', 'email', 'assignedTasks', 'actions'];
  dataSource: MatTableDataSource<any>;
  page: any = 1;
  totalItems: any;
  timeoutId: any;
  filteration: any = { page: this.page, limit: 10, name: '' };
  empty: any = '';

  constructor(
    private service: UsersService,
    private serviceTasks: TasksService,
    private toastr: ToastrService,
    private translate: TranslateService,
    public matDialog: MatDialog,
    private liveAnnouncer: LiveAnnouncer,
    private title: Title,
    private router: Router) {
    this.getUsersFromBehaviorSubject();
    this.title.setTitle('Tasks | All Users')
  }

  ngOnInit(): void {
    this.service.getUsersData(this.filteration);
  }

  /*   Search By Name */
  search(event: any) {
    this.filteration.name = event.value;
    this.filteration.page = 1;
    this.page = 1;
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.service.getUsersData(this.filteration);
    }, 500);
  }

  /* Get Users from server */
  /* put Users inside dataSource array then call them by mat-table */
  getUsersFromBehaviorSubject() {
    this.service.userData.subscribe((res: any) => {
      this.dataSource = new MatTableDataSource<any>(res.data);
      this.totalItems = res.totalItems;
      this.dataSource.sort = this.sort;
    })
  }

  /* Sort column data by clicking on arrow */
  sortData(sortState: Sort) {
    if (sortState.direction) {
      this.liveAnnouncer.announce(sortState.direction);
    }
  }

  /* Delete User from server */
  /* Open confirmation dialog */
  deleteUser(id: string, index: number) {
    this.serviceTasks.messageConfirm = this.translate.instant('confirmation.message-delete-user');
    const dialogRef = this.matDialog.open(ConfirmationComponent, {
      width: '650px',
    })
    dialogRef.afterClosed().subscribe((res: any) => {
      if (this.serviceTasks.dialogConfirm == 'yes') {
        if (this.dataSource.data[index].assignedTasks > 0) {
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

  /* Chnage User Status ( Active & In-Active ) */
  changeUserStatus(status: any, id: string, index: number) {
    if (this.dataSource.data[index].assignedTasks > 0) {
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

  /* Switch between table pages in pagination bar */
  changePage(event: any) {
    this.page = event;
    this.filteration['page'] = event;
    this.service.getUsersData(this.filteration);
  }

}
