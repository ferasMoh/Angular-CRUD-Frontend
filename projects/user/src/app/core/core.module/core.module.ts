import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { LoaderInterceptor } from './interceptors/loader.interceptor';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers:[
    {
      useClass : AuthInterceptor,
      provide : HTTP_INTERCEPTORS,
      multi : true
    },
    {
      useClass : ErrorInterceptor,
      provide : HTTP_INTERCEPTORS,
      multi : true
    },
    {
      useClass : LoaderInterceptor,
      provide : HTTP_INTERCEPTORS,
      multi : true
    }
  ],
})
export class CoreModule { }
