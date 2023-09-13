import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskComponent } from '../add-task/add-task.component';
import { TasksService } from '../../services/tasks.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { UsersService } from '../../../manage-users/services/users.service';
import { ConfirmationComponent } from '../../../confirmation/confirmation.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Title } from '@angular/platform-browser';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-list-tasks',
  templateUrl: './list-tasks.component.html',
  styleUrls: ['./list-tasks.component.scss'],
})
export class ListTasksComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;

  dataSource: MatTableDataSource<any>;
  users: any = [];
  timeoutId: any;
  page: any = 1;
  total: any;
  filteration: any = { page: this.page, limit: 10 };
  selection = new SelectionModel<any>(true, []);
  selectedRows: any[] = [];

  /*   Tabel Columns Header Definitions */
  displayedColumns: string[] = [
    'image',
    'title',
    'user',
    'deadline',
    'status',
    'actions'
  ];

  /*   Status Array in Selection Form */
  status: any = [
    { name: '' },
    { name: 'Complete' },
    { name: 'In-Progress' },
  ];

  constructor(
    private service: TasksService,
    public matDialog: MatDialog,
    private toastr: ToastrService,
    private translate: TranslateService,
    private userService: UsersService,
    private liveAnnouncer: LiveAnnouncer,
    private title: Title,
  ) {
    this.getUsersFromBehaviorSubject();
    this.title.setTitle('Tasks | All Tasks')
  }

  ngOnInit(): void {
    this.getUsers();
    this.getAllTasks();
  }

  /*   Mapping for Table Tasks for getting user rather than userId.username  */
  mappingTasks(data: any[]) {
    let newTasks = data.map((item) => {
      return {
        ...item,
        user: item.userId?.username
      };
    });
    return newTasks;
  }

  /*   Get All Tasks  */
  getAllTasks() {
    this.service.getAllTasks(this.filteration).subscribe(
      (result: any) => {
        this.dataSource = new MatTableDataSource<any>(this.mappingTasks(result.tasks));
        this.total = result.totalItems;
        this.dataSource.sort = this.sort;
      },
    );
  }

  /*  Get User data  */
  getUsers() {
    this.userService.getUsersData();
  }

  /*  Create new array to catch only username and id from users service */
  usersMapping(data: any) {
    let newUsers = data?.map((item: any) => {
      return {
        name: item.username,
        id: item._id
      }
    });
    return newUsers;
  }

  /* Call all users from behaviour subject after mapping then store it in users Array */
  getUsersFromBehaviorSubject() {
    this.userService.userData.subscribe((res: any) => {
      this.users = this.usersMapping(res.data);
    })
  }

  /* Sort column data by clicking on arrow */
  sortData(sortState: Sort) {
    if (sortState.direction) {
      this.liveAnnouncer.announce(sortState.direction);
    }
  }

  /*   Search By Title */
  search(event: any): void {
    this.filteration['keyword'] = event.value;
    this.page = 1;
    this.filteration['page'] = 1;
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.getAllTasks();
    }, 500);
  }

  /*   Search By User */
  selectUser(event: any) {
    this.filteration['userId'] = event.value
    this.page = 1;
    this.filteration['page'] = 1;
    this.getAllTasks();
  }

  /*   Search By Status */
  selectStatus(event: any) {
    this.filteration['status'] = event.value;
    this.page = 1;
    this.filteration['page'] = 1;
    this.getAllTasks()
  }

  /*   Search By Date */
  selectDate(event: any, type: any) {
    this.page = 1;
    this.filteration['page'] = 1;
    this.filteration[type] = moment(event.value).format('DD/MM/YYYY');
    if (type == 'toDate' && this.filteration['toDate'] !== 'Invalid date') {
      this.getAllTasks();
    }
  }

  /*   Open Add Task Dialog */
  addTask() {
    const dialogRef = this.matDialog.open(AddTaskComponent, {
      width: '750px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.getAllTasks();
      }
    });
  }

  /*   Open Edit Task Dialog and send element data */
  editTask(element: any) {
    const dialogRef = this.matDialog.open(AddTaskComponent, {
      width: '750px',
      data: element,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res == true) {
        this.getAllTasks();
      }
    });
  }

  /* Delete Task */
  deleteTask(id: any) {
    this.service.messageConfirm = this.translate.instant('confirmation.message-delete-task');

    const dialogRef = this.matDialog.open(ConfirmationComponent, {
      width: '600px',
      disableClose: true
    })

    dialogRef.afterClosed().subscribe((res: any) => {
      if (this.service.dialogConfirm == 'yes') {
        this.service.deleteTask(id).subscribe(
          (res) => {
            this.toastr.success(this.translate.instant("toastr.success-delete"));
            this.service.dialogConfirm == 'no'
            this.getAllTasks();
          },
        )
      }
    })

  }

  /* Switch between table pages in pagination bar */
  changePage(event: any) {
    this.page = event;
    this.filteration['page'] = event;
    this.getAllTasks();
  }

}