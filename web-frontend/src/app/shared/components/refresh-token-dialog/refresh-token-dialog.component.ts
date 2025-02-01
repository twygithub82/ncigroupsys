import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Utility } from 'app/utilities/utility';
import { UnsubscribeOnDestroyAdapter } from '@shared/UnsubscribeOnDestroyAdapter';

export interface DialogData {
  action: string;
}

@Component({
  selector: 'app-refresh-token-dialog',
  templateUrl: './refresh-token-dialog.component.html',
  styleUrls: ['./refresh-token-dialog.component.scss'],
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    TranslateModule,
  ],
})
export class RefreshTokenDialogComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  headerText?: string;
  countdown: number = 60;
  countdownInterval: any;

  translatedLangText: any = {}
  langText: any = {
    RENEW: 'COMMON-FORM.RENEW',
    LOGOUT: 'COMMON-FORM.LOGOUT',
    SESSION_EXPIRE_WARNING: 'COMMON-FORM.SESSION-EXPIRE-WARNING',
    SESSION_EXPIRE_WARNING_DESCRIPTION: 'COMMON-FORM.SESSION-EXPIRE-WARNING-DESCRIPTION'
  }

  constructor(
    public dialogRef: MatDialogRef<RefreshTokenDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private translate: TranslateService
  ) {
    super();
    // Set the defaults
    this.translateLangText();
  }

  ngOnInit() {
    this.headerText = this.translatedLangText.SESSION_EXPIRE_WARNING;
    this.countdown = 60;
    this.countdownInterval = setInterval(() => {
      this.countdown--;

      if (this.countdown === 0) {
        this.stopCountdown();
        console.log('Countdown finished - Logging out user');
        this.dialogRef.close('timeout');
      }
    }, 1000);
  }

  override ngOnDestroy(): void {
    console.log('refreshToken ngOnDestroy');
    this.stopCountdown();
  }

  private stopCountdown() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }

  getDescription() {
    return this.translatedLangText.SESSION_EXPIRE_WARNING_DESCRIPTION.replace('{0}', this.countdown.toString());
  }

  onLogout(): void {
    this.dialogRef.close('logout');
  }

  onRenew(): void {
    this.dialogRef.close('renew');
  }
}
