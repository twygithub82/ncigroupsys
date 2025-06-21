import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from 'app/shared/components/breadcrumb/breadcrumb.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {SingletonNotificationService,MessageItem} from '@core/service/singletonNotification.service';
import { Apollo } from 'apollo-angular';
import { TranslateService } from '@ngx-translate/core';
import { ModulePackageService } from 'app/services/module-package.service';
import { Utility } from 'app/utilities/utility';
import { InGateDS } from 'app/data-sources/in-gate';
import { OutGateDS } from 'app/data-sources/out-gate';

@Component({
    selector: 'dashboard-outgate-survey-waiting',
    templateUrl: './out_gate_survey_waiting.component.html',
    styleUrls: ['./out_gate_survey_waiting.component.scss'],
    standalone: true,
    imports: [
      CommonModule,
      BreadcrumbComponent,
      MatProgressSpinnerModule
    ],
})
export class OutGateSurveyWaitingComponent {

  topic :string ="SOT_UPDATED";
  out_gate_yet_to_survey: string = '0';
  ogDS: OutGateDS;
  msgReceived: string='';
  sot_waiting: string = "-";
  translatedLangText: any = {}
   langText = {
    OUT_GATE_SURVEY_PENDING: 'COMMON-FORM.OUT-GATE-SURVEY-PENDING',
   };
  prevSotWaiting: String = '';
  blinkClass = '';
  constructor(private notificationService:SingletonNotificationService, 
    private apollo: Apollo,
    private translate: TranslateService,
    public modulePackageService: ModulePackageService) {
    this.initializeSubscription();
    this.ogDS= new OutGateDS(this.apollo);
    
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
    this.ogDS.getOutGateCountForYetToSurvey().subscribe(data => {
      this.out_gate_yet_to_survey = String(data);
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
      var changedValue=(message.payload?.Pending_Cleaning_Count||-1);
      if(changedValue>=0)
      {

        const newValue =String(changedValue);
        this.prevSotWaiting = this.out_gate_yet_to_survey;
        this.out_gate_yet_to_survey = newValue;
        this.blinkClass = 'blink';

        // remove blink class after animation ends to allow retrigger
        setTimeout(() => this.blinkClass = '', 1500);
      }
    }
  });
  }

}
