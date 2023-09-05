import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TasksService } from '../tasks-admin/services/tasks.service';
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
    private router: Router,
    private serviceTasks: TasksService,
    public matDialog: MatDialog
  ) {
    this.lang = this.translate.currentLang;
  }

  /*  Change Language */
  /*  Language will storing in local storage to be the main language then page will be reloading */
  changeLang() {
    if (this.lang == 'en') {
      localStorage.setItem('language', 'ar');
    } else {
      localStorage.setItem('language', 'en');
    }
    window.location.reload();
  }

  /* Logout button */
  /* open confirmation dialog */
  /* Token will remove from local Storage then navigate to login page */
  logout() {
    if ('token' in localStorage) {
      this.serviceTasks.messageConfirm = this.translate.instant('confirmation.message-logout');
      const dialogRef = this.matDialog.open(ConfirmationComponent, {
        width: '650px',
      });
      dialogRef.afterClosed().subscribe((res: any) => {
        if (this.serviceTasks.dialogConfirm == 'yes') {
          localStorage.removeItem('token');
          this.router.navigate(['login']);
          this.serviceTasks.dialogConfirm = 'no';
        }
      })
    }
  }
} 
