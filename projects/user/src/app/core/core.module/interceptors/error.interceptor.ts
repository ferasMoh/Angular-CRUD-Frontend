import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private toastr: ToastrService,
    private router: Router,
  ) { }

  /*   When the error occurs this interceptor will appearing a message
    and remove token then navigate you to login page
  */

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        this.toastr.error(error.error.message);
        if (error.error.message == 'jwt expired' ||
          error.error.message == 'jwt must provided' ||
          error.error.message == 'jwt malformed'
        ) {
          this.router.navigate(['auth/login']);
          localStorage.removeItem('token');
        }
        throw Error;
      })
    );
  }
}
