import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TranslateModule } from '@ngx-translate/core';
import { TemplateEstPartItem } from 'app/data-sources/master-template';

export interface DialogData {
  action: string;
  item: StoringOrderTankItem;
  langText?: any;
  index: number;
}

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss'],
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
export class DeleteDialogComponent {
  rep: any;
  index: number;
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    // Set the defaults
    this.rep = data.item;
    this.index = data.index;
  }
  onNoClick(): void {
    this.dialogRef.close('cancel');
  }
  confirmDelete(): void {
    const returnDialog: DialogData = {
      action: 'confirmed',
      item: this.rep,
      index: this.index
    }
    this.dialogRef.close(returnDialog);
  }


  getDescription(row: TemplateEstPartItem): String {
    var retval: String = "";

    if (row?.tariff_repair) {
      const partName = row?.tariff_repair?.part_name!;
      let dimension = row?.tariff_repair.alias?.replace(partName, '')!;
      if (dimension) dimension = ` - ${dimension} `;
      retval = `${row.description} ${dimension}`;
    }

    return retval;
  }
}
