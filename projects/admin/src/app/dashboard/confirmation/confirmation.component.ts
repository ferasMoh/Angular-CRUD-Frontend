import { Component, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { TasksService } from '../tasks-admin/services/tasks.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
})
export class ConfirmationComponent {

  constructor(
    public dialog: MatDialogRef<ConfirmationComponent>,
    public matDialog: MatDialog,
    private service:TasksService,
    private translate:TranslateService
  ){}
  discardChanges:string = this.translate.instant('confirmation.message-close')
  messageConfirm:string = this.service.messageConfirm;
  

  confirm(){
    this.service.dialogConfirm = 'yes';
    this.dialog.close();
    this.service.messageConfirm = '';
  }

  confirmClosingDialog(){
    this.matDialog.closeAll();
    this.service.messageConfirm = '';
 }

  cancel(){
    this.dialog.close();
    this.service.dialogConfirm = 'no';
    this.service.messageConfirm = '';
  }

  
}
