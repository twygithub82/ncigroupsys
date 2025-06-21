import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BreadcrumbComponent } from 'app/shared/components/breadcrumb/breadcrumb.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {SingletonNotificationService,MessageItem} from 'app/core/service/singletonNotification.service'
import { Apollo } from 'apollo-angular';
import { ModulePackageService } from 'app/services/module-package.service';
import { TranslateService } from '@ngx-translate/core';
import { Utility } from 'app/utilities/utility';
import { StoringOrderTankDS } from 'app/data-sources/storing-order-tank';

@Component({
    selector: 'dashboard-gateio',
    templateUrl: './gateio.component.html',
    styleUrls: ['./gateio.component.scss'],
    standalone: true,
    imports: [
      BreadcrumbComponent,
      MatProgressSpinnerModule,
      CommonModule
    ],
})
export class DashboardGateIOComponent {

   result_gate_in:string="-";
   result_gate_out:string="-";
   topic :string ="SOT_UPDATED";
   sotDS: StoringOrderTankDS;
   msgReceived: string='';
   translatedLangText: any = {}
   langText = {
    GATE_IN: 'COMMON-FORM.GATE-IN',
    GATE_OUT: 'COMMON-FORM.GATE-OUT',
   };
  prevInGateValue: String = '';
  prevOutGateValue: String = '';
  blinkClass_InGate = '';
  blinkClass_OutGate = '';
  constructor(private notificationService:SingletonNotificationService, 
      private apollo: Apollo,
      private translate: TranslateService,
      public modulePackageService: ModulePackageService) {
    this.initializeSubscription();
    this.sotDS= new StoringOrderTankDS(this.apollo);
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

     if(message.event_name==="2020")
    {
      var changedValueInGate=(message.payload?.Pending_Cleaning_Count||-1);
      if(changedValueInGate>=0)
      {

        const newValue =String(changedValueInGate);
        this.prevInGateValue = this.result_gate_in;
        this.result_gate_in = newValue;
        this.blinkClass_InGate = 'blink';

        // remove blink class after animation ends to allow retrigger
        setTimeout(() => this.blinkClass_InGate = '', 1500);
      }

      var changedValueOutGate=(message.payload?.Pending_Cleaning_Count||-1);
      if(changedValueOutGate>=0)
      {

        const newValue =String(changedValueOutGate);
        this.prevOutGateValue = this.result_gate_out;
        this.result_gate_out = newValue;
        this.blinkClass_OutGate = 'blink';

        // remove blink class after animation ends to allow retrigger
        setTimeout(() => this.blinkClass_OutGate = '', 1500);
      }
    }
  });
  }


  private loadData() {
    // this.sot_waiting ="-";
    // this.sotDS.getInCompleteResidueCount().subscribe(data => {
    //   this.sot_waiting = String(data);
    // });

    this.sotDS.getTotalGateInTodayCount().subscribe(data => {
      this.result_gate_in = String(data);
    });

    this.sotDS.getTotalGateOutTodayCount().subscribe(data => {
      this.result_gate_out = String(data);
    });
  }

}
