import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';

@Injectable({
  providedIn: 'root',
})

export class StoringOrderService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = 'assets/data/advanceTable.json';
  isTblLoading = true;
  dataChange: BehaviorSubject<StoringOrderTankItem[]> = new BehaviorSubject<StoringOrderTankItem[]>([]);
  // Temporarily stores data from dialogs
  dialogData!: StoringOrderTankItem;
  constructor(private httpClient: HttpClient) {
    super();
  }
  get data(): StoringOrderTankItem[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getAllStoringOrderTankTables(): void {
    this.subs.sink = this.httpClient
      .get<StoringOrderTankItem[]>(this.API_URL)
      .subscribe({
        next: (data) => {
          this.isTblLoading = false;
          //this.dataChange.next(data);
        },
        error: (error: HttpErrorResponse) => {
          this.isTblLoading = false;
          console.log(error.name + ' ' + error.message);
        },
      });
  }
  addStoringOrderTank(storingOrderTank: StoringOrderTankItem): void {
    this.dialogData = storingOrderTank;

    // this.httpClient.post(this.API_URL, storingOrderTank)
    //   .subscribe({
    //     next: (data) => {
    //       this.dialogData = storingOrderTank;
    //     },
    //     error: (error: HttpErrorResponse) => {
    //        // error code here
    //     },
    //   });
  }
  updateStoringOrderTank(storingOrderTank: StoringOrderTankItem): void {
    this.dialogData = storingOrderTank;

    // this.httpClient.put(this.API_URL + storingOrderTank.id, storingOrderTank)
    //     .subscribe({
    //       next: (data) => {
    //         this.dialogData = storingOrderTank;
    //       },
    //       error: (error: HttpErrorResponse) => {
    //          // error code here
    //       },
    //     });
  }
  deleteStoringOrderTank(id: number): void {
    console.log(id);

    // this.httpClient.delete(this.API_URL + id)
    //     .subscribe({
    //       next: (data) => {
    //         console.log(id);
    //       },
    //       error: (error: HttpErrorResponse) => {
    //          // error code here
    //       },
    //     });
  }
}
