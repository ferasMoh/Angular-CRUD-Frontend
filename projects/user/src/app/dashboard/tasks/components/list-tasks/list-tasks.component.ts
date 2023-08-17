import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TasksService } from '../../services/tasks.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationComponent } from '../../../confirmation/confirmation.component';
/* 

export interface PeriodicElement {
  title: string;
  description: string;
  deadLineDate: string;
  status: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {status:'Complete' , title: 'Hydrogen', description: "1.0079", deadLineDate:"10-11-2022" },
  {status:'In-Prossing' , title: 'Helium', description: "4.0026", deadLineDate:"10-11-2022" },
  {status:'Complete' , title: 'Lithium', description: "6.941", deadLineDate:"10-11-2022" },
  {status:'Complete' , title: 'Beryllium', description: "9.0122", deadLineDate:"10-11-2022" },
  {status:'Complete' , title: 'Boron', description: "10.811", deadLineDate:"10-11-2022" },
  {status:'Complete' , title: 'Carbon', description: "12.010", deadLineDate:"10-11-2022" },
  {status:'Complete' , title: 'Nitrogen', description: "14.006", deadLineDate:"10-11-2022" },
  {status:'Complete' , title: 'Oxygen', description: "15.999", deadLineDate:"10-11-2022" },
  {status:'Complete' , title: 'Fluorine', description: "18.998", deadLineDate:"10-11-2022" },
  { status:'Complete' , title: 'Neon', description: "20.179", deadLineDate:"10-11-2022" },
];
 */

@Component({
  selector: 'app-list-tasks',
  templateUrl: './list-tasks.component.html',
  styleUrls: ['./list-tasks.component.scss']
})
export class ListTasksComponent implements OnInit {
  displayedColumns: string[] = ['position', 'title', 'user' ,'deadLineDate','status', 'actions'];
  dataSource:any = [];
  tasksFilter!:FormGroup;
  userData:any;
  page:any = 1;
  total:any = 0;
  filteration: any = { page:this.page, limit:10 };
  selectedStatus:string = "In-Progress";


  status:any = [
    {name:this.translate.instant('status.completed') , id:1},
    {name:this.translate.instant('status.in-progress') , id:2},
  ]

  constructor(
    public dialog: MatDialog ,
    private fb:FormBuilder,
    private service:TasksService,
    private toastr:ToastrService,
    private translate:TranslateService,
    private matDialog:MatDialog
    ) { }

  ngOnInit(): void {
    this.createform();
    this.getUserData();
    this.getAllTasks();
  }

  createform() {
    this.tasksFilter = this.fb.group({
      title:[''],
      userId:[''],
      fromDate:[''],
      toDate:['']
    })
  }

  changePage(event:any){
    this.page = event;
    this.getAllTasks();
  }

  getUserData(){
    let token = JSON.stringify(localStorage.getItem('token'));
    this.userData = JSON.parse(window.atob(token.split('.')[1]));
  }

  getAllTasks() {
  let params = 
    {
      page:this.page,
      status:this.selectedStatus
    }
    this.service.getUserTasks(this.userData.userId, params).subscribe((res:any)=>{
        this.dataSource = res.tasks;
        this.total =  res.totalItems;
    },error =>{
      this.dataSource = [];
    })
  }
  
  complete(item:any){
    this.service.messageConfirm = this.translate.instant('confirmation.message-complete');
    const dialogRef = this.matDialog.open(ConfirmationComponent,{
      width:'650px',
    });
    
      dialogRef.afterClosed().subscribe((res:any)=>{
        if(this.service.dialogConfirm == 'yes'){
          const model = {
            id:item._id
          }
          this.service.completeTask(model).subscribe((res:any) =>{
              this.toastr.success(this.translate.instant('toastr.success-complete'));
              this.getAllTasks();
              this.service.dialogConfirm = 'no';
            });
        }
      })
        

/*    */
    

  }


}
