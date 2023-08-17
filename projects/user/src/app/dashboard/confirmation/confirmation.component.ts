import { Component } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { TasksService } from '../tasks/services/tasks.service';



@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent {

  constructor(
    public dialog: MatDialogRef<ConfirmationComponent>,
    public matDialog: MatDialog,
    private service:TasksService,
  ){}
  

  messageConfirm:string = this.service.messageConfirm;
  

  confirm(){
    this.service.dialogConfirm = 'yes';
    this.dialog.close();
    this.service.messageConfirm = '';
  }

  cancel(){
    this.service.dialogConfirm = 'no';
    this.service.messageConfirm = '';
    this.dialog.close();
  }

  
}
