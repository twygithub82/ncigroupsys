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

@Component({
    selector: 'dashboard-residue-waiting',
    templateUrl: './residue_waiting.component.html',
    styleUrls: ['./residue_waiting.component.scss'],
    standalone: true,
    imports: [
      CommonModule,
      BreadcrumbComponent,
      MatProgressSpinnerModule
    ],
})
export class ResidueWaitingComponent {

  topic :string ="SOT_UPDATED";
  sotDS: StoringOrderTankDS;
  msgReceived: string='';
  sot_waiting: string = "-";
  translatedLangText: any = {}
   langText = {
    RESIDUE_PENDING: 'COMMON-FORM.RESIDUE-PENDING',
   };

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
    this.sotDS.getInCompleteResidueCount().subscribe(data => {
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
