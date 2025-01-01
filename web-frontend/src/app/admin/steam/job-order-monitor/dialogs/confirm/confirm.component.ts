import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TranslateModule } from '@ngx-translate/core';
import { SteamTemp,SteamItem } from 'app/data-sources/steam';

export interface DialogData {
  action: string;
  item: SteamTemp;
  langText?: any;
  overTemp?:boolean;
  //index: number;
}

@Component({
    selector: 'app-confirm',
    templateUrl: './confirm.component.html',
    styleUrls: ['./confirm.component.scss'],
    standalone: true,
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatButtonModule,
        MatDialogClose,
        TranslateModule,
    ],
})
export class ConfirmDialogComponent {
  rep: SteamItem;
 // index: number;
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    // Set the defaults
    this.rep = data.item;
   // this.index = data.index;
  }
  onNoClick(): void {
    this.dialogRef.close('cancel');
  }
  confirmComplete(): void {
    const returnDialog: DialogData = {
      action: 'confirmed',
      item: this.rep,
      //index: this.index
    }
    this.dialogRef.close(returnDialog);
  }
}
