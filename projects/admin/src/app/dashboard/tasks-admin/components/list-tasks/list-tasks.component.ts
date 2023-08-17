import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskComponent } from '../add-task/add-task.component';
import { TasksService } from '../../services/tasks.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { UsersService } from '../../../manage-users/services/users.service';
import { ConfirmationComponent } from '../../../confirmation/confirmation.component';


@Component({
  selector: 'app-list-tasks',
  templateUrl: './list-tasks.component.html',
  styleUrls: ['./list-tasks.component.scss'],
})
export class ListTasksComponent implements OnInit {


  dataSource: any = [];
  users:any = [];
  timeoutId: any;
  page:any = 1;
  total:any;
  filteration: any = { page:this.page, limit:10 };

  displayedColumns: string[] = [
    'image',
    'title',
    'user',
    'deadline',
    'status',
    'actions',
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
    private translate:TranslateService,
    private userService:UsersService,
  ) { 
    this.getUsersFromBehaviorSubject();
   }

  ngOnInit(): void {
    this.getUsers();
    this.getAllTasks();
  }

  search(event: any) {
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
    if(type == 'toDate' && this.filteration['toDate'] !== 'Invalid date'){
    this.getAllTasks();
    }
  }

  getAllTasks() {
    this.service.getAllTasks(this.filteration).subscribe(
      (res: any) => {
        this.dataSource = this.mappingTasks(res.tasks);
        this.total = res.totalItems
      },
    );
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
        width :'600px',
        disableClose: true
    })
  
    dialogRef.afterClosed().subscribe((res:any) =>{
      if(this.service.dialogConfirm == 'yes'){
        this.service.deleteTask(id).subscribe(
             (res) => {
               this.toastr.success(this.translate.instant("toastr.success-delete"));
               this.service.dialogConfirm == 'no'
               this.getAllTasks();
             },
           )}
    })

  }

  changePage(event:any){
    this.page = event;
    this.filteration['page'] = event;
    this.getAllTasks();
  }

  getUsers(){
    this.userService.getUsersData()
  }

  getUsersFromBehaviorSubject(){
    this.userService.userData.subscribe((res:any)=>{
      this.users = this.usersMapping(res.data);
    })
  }

  usersMapping(data:any){
      let newUsers = data?.map((item:any) =>{
          return {
            name:item.username,
            id:item._id
          }
      });
      return newUsers;
  }
  
}
