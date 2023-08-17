import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CreateAccount } from '../../constant/DTOs';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private service:LoginService,
    private toastr:ToastrService,
    private translate :TranslateService,
    private router:Router) {}

  registerForm!: FormGroup;

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      username: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    }, {validators:this.checkPassword});
  }

  checkPassword:ValidatorFn = (group:AbstractControl):ValidationErrors | null =>{
     let password = group.get('password')?.value;
     let confirmPassword = group.get('confirmPassword')?.value;
     return password === confirmPassword ? null : {notMatched : true}
  }

  createAccount(){
    const model:any = {
      email:this.registerForm.value['email'],
      password:this.registerForm.value['password'],
      username:this.registerForm.value['username'],
      role:'role',
    }
    this.service.createUser(model).subscribe((res:any)=>{
      localStorage.setItem("token",res.token);
      this.toastr.success(this.translate.instant('toastr.success-create-account'))
      this.router.navigate(['/tasks'])
    })
    
  }
}
