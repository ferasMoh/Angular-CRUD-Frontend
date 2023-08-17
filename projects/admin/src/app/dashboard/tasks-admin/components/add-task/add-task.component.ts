import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { TasksService } from '../../services/tasks.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';
import { UsersService } from '../../../manage-users/services/users.service';
import { ConfirmationComponent } from '../../../confirmation/confirmation.component';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export class AddTaskComponent implements OnInit {

  newTaskForm!: FormGroup;
  imgPath: string = '';
  formValues:any;
  users:any = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public dialog: MatDialogRef<AddTaskComponent>,
    public matDialog: MatDialog,
    private service: TasksService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private translate:TranslateService,
    private userService:UsersService,
  ) { this.getUsersFromBehaviorSubject(); }

  ngOnInit(): void {
    this.createFormGroup();
  }

  createFormGroup() {
    this.newTaskForm = this.fb.group({
      title: [
        this.data?.title || '',
        [Validators.required, Validators.minLength(1)],
      ],
      userId: [this.data?.userId._id || '', Validators.required],
      image: [this.data?.image || '', Validators.required],
      description: [this.data?.description || '', Validators.required],
      deadline: [ this.data ? new Date(this.data?.deadline.split('/').reverse().join('/')).toISOString() : '', Validators.required],
    });

    this.formValues = this.newTaskForm.value
  }

  selectImage(event: any) {
    this.imgPath = event.target.value;
    this.newTaskForm.get('image')?.setValue(event.target.files[0]);
  }

  createTask() {
    let model = this.prepareFormDate();
    this.service.createTask(model).subscribe(
      (res) => {
        this.toastr.success(this.translate.instant("toastr.success-create"));
        this.dialog.close(true);
      },
    );
  }

  updateTask() {
    let model = this.prepareFormDate();
    this.service.updateTask(model, this.data._id).subscribe(
      (res) => {
        this.toastr.success(this.translate.instant("toastr.success-update"));
        this.dialog.close(true);
      },
    );
  }

  close() {
    let hasChanges:boolean = false;
    Object.keys(this.formValues).forEach((item)=>{
       if(this.formValues[item] !== this.newTaskForm.value[item]){
          hasChanges = true;
        }
      })

      if(hasChanges){
        this.service.messageConfirm = this.translate.instant('confirmation.message-close');
        const dialogRef = this.matDialog.open(ConfirmationComponent, {
          width: '600px',
          disableClose: true
        });

      }else{
        this.dialog.close();
      }
  }

  prepareFormDate() {
    let newDate = moment(this.newTaskForm.value['deadline']).format(
      'DD/MM/YYYY'
    );

    let formData = new FormData();
    Object.entries(this.newTaskForm.value).forEach(([key, value]: any) => {
      if (key == 'deadline') {
        formData.append(key, newDate);
      } else {
        formData.append(key, value);
      }
    });
    return formData;
  }
  
  getUsersFromBehaviorSubject(){
    this.userService.userData.subscribe((res:any)=>{
      this.users = this.usersMapping(res.data);
    })
  }

  usersMapping(data:any){
      let newArray = data?.map((item:any) =>{
          return {
            name:item.username,
            id:item._id,
          }
      });
      return newArray;
  }

}
