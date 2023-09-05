import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!:FormGroup;
  constructor(
    private fb:FormBuilder,
    private service:LoginService,
    private router:Router,
    private toastr:ToastrService,
    private translate : TranslateService,
    private title:Title,
    ) { }
  
  ngOnInit(): void {
    this.createForm()
    this.title.setTitle('Tasks | Login')
  }

/*   Create New Form to write data in fields and make them required  */
  createForm(){
    this.loginForm = this.fb.group({
      email:['',Validators.required],
      password:['',Validators.required],
      role:['user'],
    })
  }

/*   Login proccess */
  login(){
    this.service.login(this.loginForm.value).subscribe((res:any)=>{
      localStorage.setItem("token",res.token)
      this.router.navigate(['/tasks'])
      this.toastr.success(this.translate.instant('toastr.success-login'))
  })
  }
 
}
