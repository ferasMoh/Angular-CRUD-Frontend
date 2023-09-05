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
import { TranslateService } from '@ngx-translate/core';
import { UsersService } from '../../../manage-users/services/users.service';
import { ConfirmationComponent } from '../../../confirmation/confirmation.component';
import { empty } from 'rxjs';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export class AddTaskComponent implements OnInit {

  addTaskForm: FormGroup;
  editTaskForm: any[] = [];
  imgPath: string = '';
  users: any = [];
  hasChanges: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public dialog: MatDialogRef<AddTaskComponent>,
    public matDialog: MatDialog,
    private service: TasksService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private userService: UsersService,
  ) { this.getUsersFromBehaviorSubject(); }

  ngOnInit(): void {
    this.createFormGroup();
  }

  /* Create Form Group */
  /* In Add Task dialog fields will be empty */
  /* In Edit Task dialog fields will be filled with row data */
  createFormGroup() {
    this.addTaskForm = this.fb.group({
      title: [
        this.data?.title || '',
        [Validators.required, Validators.minLength(1)],
      ],
      userId: [this.data?.userId._id || '', Validators.required],
      image: [this.data?.image || '', Validators.required],
      deadline: [this.data ? new Date(this.data?.deadline.split('/').reverse().join('/')).toISOString() : '', Validators.required],
      description: [this.data?.description || '', Validators.required],
    });

    this.editTaskForm = this.addTaskForm.value
  }

  /*   Compare if EditTask fields and addTask fields have the same values
       then hasChange value will be true   */
  compareValues() {
    Object.keys(this.editTaskForm).forEach((item: any) => {
      if (this.editTaskForm[item] !== this.addTaskForm.value[item]) {
        this.hasChanges = true;
      }
    })
  }

  /*   Create new array to catch only username and id from users service */
  usersMapping(data: any) {
    let userMapping = data?.map((item: any) => {
      return {
        name: item.username,
        id: item._id,
      }
    });
    return userMapping;
  }

  /* Call all users (username and id) after mapping when you open the dialog */
  getUsersFromBehaviorSubject() {
    this.userService.userData.subscribe((res: any) => {
      this.users = this.usersMapping(res.data);
    })
  }

  /*   Select Image from your PC    */
  /*   when you finish adding task the image will added to database in server */
  selectImage(event: any) {
    this.imgPath = event.target.value;
    this.addTaskForm.get('image')?.setValue(event.target.files[0]);
    this.compareValues()
  }

  /*   Change date fomrat like this DD/MM/YYYY */
  prepareFormDate() {
    let newDate = moment(this.addTaskForm.value['deadline']).format(
      'DD/MM/YYYY'
    );
    let formData = new FormData();
    Object.entries(this.addTaskForm.value).forEach(([key, value]: any) => {
      if (key == 'deadline') {
        formData.append(key, newDate);
      } else {
        formData.append(key, value);
      }
    });
    return formData;
  }

  /*   Create New Task after filling all the required fields */
  /*   Show success message then close the dialog */
  createTask() {
    let model = this.prepareFormDate();
    this.service.createTask(model).subscribe(
      (res) => {
        this.toastr.success(this.translate.instant("toastr.success-create"));
        this.dialog.close(true);
      },
    );
  }

  /*   Edit Task */
  /*   Show success message then close the dialog */
  editTask() {
    let model = this.prepareFormDate();
    this.service.editTask(model, this.data._id).subscribe(
      (res) => {
        this.toastr.success(this.translate.instant("toastr.success-update"));
        this.dialog.close(true);
      },
    );
  }

  /*   Close dialog */
  /*   if Task data has Changed then show confirmation dialog */
  close() {
    this.compareValues();
    if (this.hasChanges) {
      this.service.messageConfirm = this.translate.instant('confirmation.message-close');
      const dialogRef = this.matDialog.open(ConfirmationComponent, {
        width: '600px',
        disableClose: true
      });

    } else {
      this.dialog.close();
    }
  }

}
