import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TasksService } from '../../services/tasks.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationComponent } from '../../../confirmation/confirmation.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})
export class TaskDetailsComponent implements OnInit {

  taskId: any;
  taskDetails: any;

  constructor(
    private route: ActivatedRoute,
    private service: TasksService,
    private router: Router,
    private toastr: ToastrService,
    private translate: TranslateService,
    public matDialog:MatDialog,
    private title:Title
  ) {
    this.route.paramMap.subscribe((res: any) => {
      this.taskId = res.params['id'];
    });
    this.title.setTitle('Tasks | Task details')
  }

  ngOnInit(): void {
    this.gettaskDetails();
  }

  gettaskDetails() {
    this.service.taskDetails(this.taskId).subscribe((res: any) => {
      this.taskDetails = res.tasks
    })
  }

  complete() {
    this.service.messageConfirm = this.translate.instant('confirmation.message-complete');
    const dialogRef = this.matDialog.open(ConfirmationComponent,{
      width: '650px',
    })

    dialogRef.afterClosed().subscribe((res:any)=>{
      if(this.service.dialogConfirm == 'yes'){
        const model = {
          id: this.taskId
        }
        this.service.completeTask(model).subscribe((res: any) => {
          this.router.navigate(['/tasks']);
          this.toastr.success(this.translate.instant('toastr.success-complete'));
          this.service.dialogConfirm = 'no';
        });
      }
    })
  }


}
