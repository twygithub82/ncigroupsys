import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from 'app/shared/components/breadcrumb/breadcrumb.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {SingletonNotificationService,MessageItem} from 'app/core/service/singletonNotification.service';
import { StoringOrderTankDS } from 'app/data-sources/storing-order-tank';
import { Apollo } from 'apollo-angular';
import { TranslateService } from '@ngx-translate/core';
import { ModulePackageService } from 'app/services/module-package.service';
import { Utility } from 'app/utilities/utility';
import { RepairDS } from 'app/data-sources/repair';

@Component({
    selector: 'dashboard-repair-customer-approval-waiting',
    templateUrl: './customer_approval_waiting.component.html',
    styleUrls: ['./customer_approval_waiting.component.scss'],
    standalone: true,
    imports: [
      CommonModule,
      BreadcrumbComponent,
      MatProgressSpinnerModule
    ],
})
export class RepairCustomerApprovalWaitingComponent {

  topic :string ="SOT_UPDATED";
  rpDS: RepairDS;
  msgReceived: string='';
  sot_waiting: string = "-";
  translatedLangText: any = {}
   langText = {
    ESTIMATE_CUSTOMER_APPROVAL_PENDING: 'COMMON-FORM.ESTIMATE-CUSTOMER-APPROVAL-PENDING',
   };

  constructor(private notificationService:SingletonNotificationService, 
    private apollo: Apollo,
    private translate: TranslateService,
    public modulePackageService: ModulePackageService) {
    this.initializeSubscription();
    this.rpDS= new RepairDS(this.apollo);
    
  }

  ngOnInit() {
    this.translateLangText();
    this.loadData();
  }

   translateLangText() {
      Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
        this.translatedLangText = translations;
      });
    }
  

  private loadData() {
    this.sot_waiting ="-";
    this.rpDS.getRepairCustomerApprovalWaitingCount().subscribe(data => {
      this.sot_waiting = String(data);
    });
  }

  initializeSubscription() {
     this.notificationService.subscribe(this.topic, (message: MessageItem) => {
    // Handle the message here
   this.msgReceived = `${new Date().toLocaleString(undefined, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })} message Received`;
    console.log(this.msgReceived);
    this.loadData();
  });
  }

}
