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
  selectedRows:any[] = [];

  displayedColumns: string[] = [
    'select',
    'image',
    'title',
    'user',
    'deadline',
    'status',
    'actions'
  ];

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
    private title:Title,
  ) {
    this.getUsersFromBehaviorSubject();
    this.title.setTitle('Tasks | All Tasks')
  }

  ngOnInit(): void {
    this.getUsers();
    this.getAllTasks();
  }

  select(row:any, index:number){
    if(this.selection.isSelected(row)){
      this.selectedRows.push(row)
      //console.log(this.selectedRows)
    }
    if(!this.selection.isSelected(row)){
      this.selectedRows.splice(index,1)
      //console.log(this.selectedRows)
    }
  }














  isAllSelected(){
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource?.data.length;
    return numSelected === numRows;
  }

  toggleAllRows(){
    if(this.isAllSelected()){
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource?.data);
    console.log(this.selection.select(...this.dataSource?.data))
  }

  checkboxLabel(row?:any):string{
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;

  }



  getAllTasks() {
    this.service.getAllTasks(this.filteration).subscribe(
      (result: any) => {
        this.dataSource = new MatTableDataSource<any>(this.mappingTasks(result.tasks));
        this.total = result.totalItems;
        this.dataSource.sort = this.sort;
      },
    );
  }

  sortData(sortState: Sort) {
    if (sortState.direction) {
      this.liveAnnouncer.announce(sortState.direction);
    }
  }

  search(event: any):void {
    this.filteration['keyword'] = event.value;
    this.page = 1;
    this.filteration['page'] = 1;
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.getAllTasks();
    }, 500);

  }

  selectUser(event: any) {
    this.filteration['userId'] = event.value
    this.page = 1;
    this.filteration['page'] = 1;
    this.getAllTasks();
  }

  selectStatus(event: any) {
    this.filteration['status'] = event.value;
    this.page = 1;
    this.filteration['page'] = 1;
    this.getAllTasks()
  }

  selectDate(event: any, type: any) {
    this.page = 1;
    this.filteration['page'] = 1;
    this.filteration[type] = moment(event.value).format('DD/MM/YYYY');
    if (type == 'toDate' && this.filteration['toDate'] !== 'Invalid date') {
      this.getAllTasks();
    }
  }


  mappingTasks(data: any[]) {
    let newTasks = data.map((item) => {
      return {
        ...item,
        user: item.userId?.username
      };
    });
    return newTasks;
  }

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

  editTask(element: any) {
    const dialogRef = this.matDialog.open(AddTaskComponent, {
      width: '750px',
      data: element,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.getAllTasks();
      }
    });
  }

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

  changePage(event: any) {
    this.page = event;
    this.filteration['page'] = event;
    this.getAllTasks();
  }

  getUsers() {
    this.userService.getUsersData()
  }

  getUsersFromBehaviorSubject() {
    this.userService.userData.subscribe((res: any) => {
      this.users = this.usersMapping(res.data);
    })
  }

  usersMapping(data: any) {
    let newUsers = data?.map((item: any) => {
      return {
        name: item.username,
        id: item._id
      }
    });
    return newUsers;
  }

}
