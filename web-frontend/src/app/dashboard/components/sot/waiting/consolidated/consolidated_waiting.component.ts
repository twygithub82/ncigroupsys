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
import { NgScrollbar } from 'ngx-scrollbar';
import { InGateDS } from 'app/data-sources/in-gate';
@Component({
    selector: 'dashboard-consolidated-waiting',
    templateUrl: './consolidated_waiting.component.html',
    styleUrls: ['./consolidated_waiting.component.scss'],
    standalone: true,
    imports: [
      CommonModule,
      BreadcrumbComponent,
      MatProgressSpinnerModule,
      NgScrollbar
    ],
})
export class ConsolidatedWaitingComponent {

  topic :string ="SOT_UPDATED";
  sotDS: StoringOrderTankDS;
  msgReceived: string='';
  sot_waiting: string = "-";
  result_cleaning:string = "-";
  result_gate_in:string = "-";
  result_in_gate_survey:string = "-";
  result_residue:string = "-";
  result_repair_estimate:string = "-";
  result_estimate_approval:string = "-";

  igDS: InGateDS;

  translatedLangText: any = {}
   langText = {
    RESIDUE: 'COMMON-FORM.RESIDUE',
    PENDING_STATUS:'COMMON-FORM.PENDING-STATUS',
    IN_GATE_SURVEY: 'COMMON-FORM.IN-GATE-SURVEY',
    GATE_IN:'COMMON-FORM.GATE-IN',
    CLEANING:'COMMON-FORM.CLEANING',
    ESTIMATE_APPROVAL:'COMMON-FORM.ESTIMATE-APPROVAL',
    REPAIR_ESTIMATE:'COMMON-FORM.REPAIR-ESTIMATE',
   };

  constructor(private notificationService:SingletonNotificationService, 
    private apollo: Apollo,
    private translate: TranslateService,
    public modulePackageService: ModulePackageService) {
    this.initializeSubscription();
    this.sotDS= new StoringOrderTankDS(this.apollo);
    this.igDS= new InGateDS(this.apollo);
    
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
    this.loadData();
  });
  }

 onIconClick(event: MouseEvent, transactionType: string, amount: number) {
    event.stopPropagation(); // Prevent event bubbling
    
    console.log(`Icon clicked - Type: ${transactionType}, Amount: ${amount}`);
    
    // Add your custom logic here
    this.showTransactionDetails(transactionType, amount);
    
    // Optional: Add visual feedback
    const iconBox = event.target as HTMLElement;
    iconBox.classList.add('icon-clicked');
    setTimeout(() => iconBox.classList.remove('icon-clicked'), 200);
  }

  showTransactionDetails(type: string, amount: number) {
    // Implement your logic to show details
    alert(`Transaction Details:\nType: ${type}\nAmount: ${amount}`);
  }

  loadData()
  {
     this.igDS.getInGateCountForYetToSurvey().subscribe(data => {
      this.result_in_gate_survey = String(data);
    });

    
    this.sotDS.getInCompleteResidueCount().subscribe(data => {
      this.result_residue = String(data);
    });

    this.sotDS.getInCompleteCleaningCount().subscribe(data => {
      this.result_cleaning = String(data);
    });

     this.sotDS.getRepairCustomerApprovalWaitingCount().subscribe(data => {
      this.result_estimate_approval = String(data);
    });

    this.sotDS.getRepairEstimateWaitingCount().subscribe(data => {
      this.result_repair_estimate = String(data);
    });

      this.sotDS.getWaitingStoringOrderTankCount().subscribe(data => {
      this.result_gate_in = String(data);
    });
  }

}
