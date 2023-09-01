import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private srevice: LoginService,
    private toastr: ToastrService,
    private router: Router,
    private translate: TranslateService,
    private title: Title,
  ) {
    this.title.setTitle('Tasks | Login')
  }

  logInForm!: FormGroup

  ngOnInit(): void {
    this.createForm()
  }

  /* Login Form */

  createForm() {
    this.logInForm = this.fb.group({
      email: ['', [Validators?.required, Validators?.email]],
      password: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      role: ['admin'],
    })
  }

  /* Login button */

  logIn() {
    this.srevice.logIn(this.logInForm.value).subscribe((res: any) => {
      localStorage.setItem("token", res.token)
      this.toastr.success(this.translate.instant("toastr.success-login"))
      this.router.navigate(['/tasks'])
    })
  }

}
