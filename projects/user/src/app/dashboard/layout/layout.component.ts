import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TasksService } from '../tasks/services/tasks.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationComponent } from '../confirmation/confirmation.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  lang: any = 'en';
  constructor(
    private translate: TranslateService,
    private service: TasksService,
    private router: Router,
    public matDialog: MatDialog
  ) {
    this.lang = this.translate.currentLang;
  }

  changeLang() {
    if (this.lang === 'en') {
      localStorage.setItem('language', 'ar');
    } else {
      localStorage.setItem('language', 'en')
    }
    window.location.reload()
  }

  logout() {
  if('token' in localStorage){
      this.service.messageConfirm = this.translate.instant('confirmation.message-logout');
      const dialogRef = this.matDialog.open(ConfirmationComponent, {
        width: '650px',
      })
      dialogRef.afterClosed().subscribe((res: any) => {
        if (this.service.dialogConfirm == 'yes') {
          localStorage.removeItem('token');
          this.router.navigate(['auth/login']);
          this.service.dialogConfirm = 'no';
        }
      })}else{
        this.router.navigate(['auth/login']);
      }
    
  }

}
