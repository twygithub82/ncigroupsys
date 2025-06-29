import { Direction } from '@angular/cdk/bidi';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialogComponent, DialogData } from '@shared/components/confirmation-dialog/confirmation-dialog.component';

@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
  constructor(private dialog: MatDialog) { }

  open(data: DialogData, disableClose: boolean = false, removeOverflow: boolean = true): MatDialogRef<ConfirmationDialogComponent, any> {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    return this.dialog.open(ConfirmationDialogComponent, {
      data,
      panelClass: removeOverflow ? 'confirmation-dialog-panel' : '',
      disableClose: disableClose,
      direction: tempDirection
    });
  }
}
