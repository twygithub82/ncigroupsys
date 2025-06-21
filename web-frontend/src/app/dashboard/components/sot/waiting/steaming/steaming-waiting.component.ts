import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from 'app/shared/components/breadcrumb/breadcrumb.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {SingletonNotificationService,MessageItem} from '@core/service/singletonNotification.service';
import { StoringOrderTankDS } from 'app/data-sources/storing-order-tank';
import { Apollo } from 'apollo-angular';
import { TranslateService } from '@ngx-translate/core';
import { ModulePackageService } from 'app/services/module-package.service';
import { Utility } from 'app/utilities/utility';
import { InGateCleaningDS } from 'app/data-sources/in-gate-cleaning';

@Component({
    selector: 'dashboard-steaming-waiting',
    templateUrl: './steaming-waiting.component.html',
    styleUrls: ['./steaming-waiting.component.scss'],
    standalone: true,
    imports: [
      CommonModule,
      BreadcrumbComponent,
      MatProgressSpinnerModule
    ],
})
export class SteamingWaitingComponent {

  topic :string ="SOT_UPDATED";
  sotDS: StoringOrderTankDS;
  msgReceived: string='';
  sot_waiting: string = "-";
  translatedLangText: any = {}
   langText = {
    STEAMING_PENDING: 'COMMON-FORM.STEAMING-PENDING',
   };
  prevSotWaiting: String = '';
  blinkClass = '';
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
  

  private loadData() {
    this.sot_waiting ="-";
    this.sotDS.getTotalSteamingWaitingCount().subscribe(data => {
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
    if(message.event_id==="2020")
    {
      var changedValue=(message.payload?.Pending_Steaming_Count||-1);
      if(changedValue>=0)
      {

        const newValue =String(changedValue);
        this.prevSotWaiting = this.sot_waiting;
        this.sot_waiting = newValue;
        this.blinkClass = 'blink';

        // remove blink class after animation ends to allow retrigger
        setTimeout(() => this.blinkClass = '', 1500);
      }
    }
    // this.loadData();
  });
  }

}
