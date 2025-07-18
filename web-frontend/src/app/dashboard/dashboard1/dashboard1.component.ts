import { CdkDrag, CdkDragHandle, CdkDragPlaceholder, CdkDropList } from '@angular/cdk/drag-drop';
import { CommonModule, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { InGateDS } from 'app/data-sources/in-gate';
import { StoringOrderTankDS } from 'app/data-sources/storing-order-tank';
import { Utility,pageSizeInfo } from 'app/utilities/utility';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexGrid, ApexLegend, ApexMarkers, ApexPlotOptions, ApexResponsive, ApexStroke, ApexTitleSubtitle, ApexTooltip, ApexXAxis, ApexYAxis, NgApexchartsModule } from 'ng-apexcharts';
import { NgScrollbar } from 'ngx-scrollbar';
import { Subscription } from 'rxjs';
import { GraphqlNotificationService } from '../../services/global-notification.service';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { FeatherIconsComponent } from '../../shared/components/feather-icons/feather-icons.component';
import { ModulePackageService } from 'app/services/module-package.service';
import { AuthService } from '@core/service/auth.service';
import { debounceTime, take } from 'rxjs/operators';
import { TestComponent } from '../components/test/test.component';
import { Test1Component } from '../components/test1/test1.component';
import { GateInWaitingComponent } from '../components/sot/waiting/gate-in/gatein_waiting.component';
import { InGateSurveyWaitingComponent } from '../components/sot/notsurvey/in_gate/in_gate_survey_waiting.component';
import { CleaningWaitingComponent } from '../components/sot/waiting/cleaning/cleaning_waiting.component';
import { ResidueWaitingComponent } from '../components/sot/waiting/residue/residue_waiting.component';
import { RepairEstimateWaitingComponent } from '../components/sot/waiting/repair/estimate/estimate_waiting.component';
import { RepairCustomerApprovalWaitingComponent } from '../components/sot/waiting/repair/customer_approval/customer_approval_waiting.component';
import { ConsolidatedWaitingComponent } from '../components/sot/waiting/consolidated/consolidated_waiting.component';
import { RepairQCWaitingComponent } from '../components/sot/waiting/repair/qc_incomplete/qc_waiting.component';
import { DashboardGateIOComponent } from '../components/gate/io/gateio.component';
import { TankInYardComponent } from '../components/sot/in-yard/tank-in-yard.component';
import { TankInSteamingComponent } from '../components/sot/steaming/tank-in-steaming.component';
import { OutGateSurveyWaitingComponent } from '../components/sot/notsurvey/out_gate/out_gate_survey_waiting.component';
import { SteamingWaitingComponent } from '../components/sot/waiting/steaming/steaming-waiting.component';
import { TankTestDueComponent } from '../components/sot/due/test/tank-test-due.component';
import { CleaningKIVComponent } from '../components/sot/KIV/cleaning/cleaning_kiv.component';
import { ReleaseWaitingComponent } from '../components/sot/waiting/release/release-waiting.component';
import { GateOutPublishWaitingComponent } from '../components/sot/waiting/publish/gate-out/gateout_publish_waiting.component';
import { GateInPublishWaitingComponent } from '../components/sot/waiting/publish/gate-in/gatein_publish_waiting.component';
import { SearchStateService } from 'app/services/search-criteria.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  responsive: ApexResponsive[];
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  colors: string[];
  labels: string[];
  markers: ApexMarkers;
  grid: ApexGrid;
  title: ApexTitleSubtitle;

};
@Component({
  selector: 'app-dashboard1',
  templateUrl: './dashboard1.component.html',
  styleUrls: ['./dashboard1.component.scss'],
  standalone: true,
  imports: [
    BreadcrumbComponent,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    FeatherIconsComponent,
    NgApexchartsModule,
    NgScrollbar,
    RouterLink,
    MatProgressBarModule,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    MatCheckboxModule,
    CdkDragPlaceholder,
    MatTooltipModule,
    MatProgressSpinnerModule,
    NgClass,
    CommonModule,
    TestComponent,
    Test1Component,
    InGateSurveyWaitingComponent,
    OutGateSurveyWaitingComponent,
    GateInWaitingComponent,
    CleaningWaitingComponent,
    ResidueWaitingComponent,
    RepairEstimateWaitingComponent,
    RepairCustomerApprovalWaitingComponent,
    ConsolidatedWaitingComponent,
    RepairQCWaitingComponent,
    DashboardGateIOComponent,
    TankInYardComponent,
    TankInSteamingComponent,
    SteamingWaitingComponent,
    TankTestDueComponent,
    CleaningKIVComponent,
    ReleaseWaitingComponent,
    GateOutPublishWaitingComponent,
    GateInPublishWaitingComponent
  ],
})

export class Dashboard1Component implements OnInit {

  translatedLangText: any = {};
  langText = {
    DASHBOARD: 'COMMON-FORM.DASHBOARD',
    IN_GATE_SURVEY_PENDING: 'COMMON-FORM.IN-GATE-SURVEY-PENDING',
    GATE_IN_PENDING: 'COMMON-FORM.GATE-IN-PENDING',
    ESTIMATE_CUSTOMER_APPROVAL_PENDING: 'COMMON-FORM.ESTIMATE-CUSTOMER-APPROVAL-PENDING',
    REPAIR_ESTIMATE_PENDING: 'COMMON-FORM.REPAIR-ESTIMATE-PENDING',
    REPAIR_QC_PENDING: 'COMMON-FORM.REPAIR-QC-PENDING',
    CLEANING_PENDING: 'COMMON-FORM.CLEANING-PENDING',
    RESIDUE_PENDING: 'COMMON-FORM.RESIDUE-PENDING',
    GATEIO: 'COMMON-FORM.GATEIO',
    TANK_IN_YARD: 'COMMON-FORM.TANK-IN-YARD',
    STEAMING_PENDING: 'COMMON-FORM.STEAMING-PENDING',
    TANK_PERIODIC_TEST_DUE: 'COMMON-FORM.TANK-PERIODIC-TEST-DUE',
    CLEANING_KIV: 'COMMON-FORM.CLEANING-KIV',
    RELEASE_PENDING: 'COMMON-FORM.RELEASE-PENDING',
    GATE_OUT_PUBLISH_PENDING: 'COMMON-FORM.GATE-OUT-PUBLISH-PENDING',
    GATE_IN_PUBLISH_PENDING: 'COMMON-FORM.GATE-IN-PUBLISH-PENDING',
  }
  pageTitle = ''
  breadcrumsMiddleList = [
  ]

  public areaChartOptions!: Partial<ChartOptions>;
  public barChartOptions!: Partial<ChartOptions>;
  public earningOptions!: Partial<ChartOptions>;
  public performanceRateChartOptions!: Partial<ChartOptions>;
  graphqlNotificationService?: GraphqlNotificationService
  messageSubscription?: Subscription;
  in_gate_yet_to_survey?: number = 0;
  sot_waiting?: number = 0;


  constructor(
    private router: Router,
    private apollo: Apollo,
    private translate: TranslateService,
    public modulePackageService: ModulePackageService,
    private searchStateService: SearchStateService,
  ) {
    // this.graphqlNotificationService = new GraphqlNotificationService(this.apollo);
    // this.igDS = new InGateDS(this.apollo);
    // this.sotDS = new StoringOrderTankDS(this.apollo);
    //constructor
    this.translateLangText();
  }

  ngOnInit() {
    // this.chart1();
    // this.chart3();
    // this.chart2();
    // this.chart4();
    //  this.messageSubscribe();
    // this.loadData();

  }

  private loadData() {
    // this.igDS.getInGateCountForYetToSurvey().subscribe(data => {
    //   this.in_gate_yet_to_survey = data;
    // });

    // this.sotDS.getWaitingStoringOrderTankCount().subscribe(data => {
    //   this.sot_waiting = data;
    // });
  }

  private messageSubscribe() {
    // this.messageSubscription = this.graphqlNotificationService?.newMessageReceived.subscribe(
    //   (message) => {
    //     //alert(message.messageReceived.event_id + " " + message.messageReceived.event_name);
    //     if (message.messageReceived.event_id == "2000" || message.messageReceived.event_id == "2010") {
    //       this.igDS.getInGateCountForYetToSurvey().subscribe(data => {
    //         this.in_gate_yet_to_survey = data;
    //       });

    //       // this.sotDS.getWaitingStoringOrderTankCount().subscribe(data => {
    //       //   this.sot_waiting = data;
    //       // });
    //     }

    //   },
    //   (error) => console.error(error),
    // );
  }

  // private chart1() {
  //   this.areaChartOptions = {
  //     series: [
  //       {
  //         name: 'New Clients',
  //         data: [31, 40, 28, 51, 42, 85, 77],
  //       },
  //       {
  //         name: 'Old Clients',
  //         data: [11, 32, 45, 32, 34, 52, 41],
  //       },
  //     ],
  //     chart: {
  //       height: 350,
  //       type: 'area',
  //       toolbar: {
  //         show: false,
  //       },
  //       foreColor: '#9aa0ac',
  //     },
  //     colors: ['#4FC3F7', '#7460EE'],
  //     dataLabels: {
  //       enabled: false,
  //     },
  //     stroke: {
  //       curve: 'smooth',
  //     },
  //     grid: {
  //       show: true,
  //       borderColor: '#9aa0ac',
  //       strokeDashArray: 1,
  //     },
  //     xaxis: {
  //       type: 'datetime',
  //       categories: [
  //         '2018-09-19',
  //         '2018-09-20',
  //         '2018-09-21',
  //         '2018-09-22',
  //         '2018-09-23',
  //         '2018-09-24',
  //         '2018-09-25',
  //       ],
  //     },
  //     legend: {
  //       show: true,
  //       position: 'top',
  //       horizontalAlign: 'center',
  //       offsetX: 0,
  //       offsetY: 0,
  //     },

  //     tooltip: {
  //       theme: 'dark',
  //       marker: {
  //         show: true,
  //       },
  //       x: {
  //         show: true,
  //       },
  //     },
  //   };
  // }
  // private chart2() {
  //   this.barChartOptions = {
  //     series: [
  //       {
  //         name: 'New Errors',
  //         data: [44, 55, 41, 67, 22, 43],
  //       },
  //       {
  //         name: 'Bugs',
  //         data: [13, 23, 20, 8, 13, 27],
  //       },
  //       {
  //         name: 'Development',
  //         data: [11, 17, 15, 15, 21, 14],
  //       },
  //       {
  //         name: 'Payment',
  //         data: [21, 7, 25, 13, 22, 8],
  //       },
  //     ],
  //     chart: {
  //       type: 'bar',
  //       height: 350,
  //       foreColor: '#9aa0ac',
  //       stacked: true,
  //       toolbar: {
  //         show: false,
  //       },
  //     },
  //     responsive: [
  //       {
  //         breakpoint: 480,
  //         options: {
  //           legend: {
  //             position: 'bottom',
  //             offsetX: -10,
  //             offsetY: 0,
  //           },
  //         },
  //       },
  //     ],
  //     plotOptions: {
  //       bar: {
  //         horizontal: false,
  //         columnWidth: '30%',
  //       },
  //     },
  //     dataLabels: {
  //       enabled: false,
  //     },
  //     xaxis: {
  //       type: 'category',
  //       categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  //     },
  //     legend: {
  //       show: false,
  //     },
  //     grid: {
  //       show: true,
  //       borderColor: '#9aa0ac',
  //       strokeDashArray: 1,
  //     },
  //     fill: {
  //       opacity: 0.8,
  //       colors: ['#E82742', '#2F3149', '#929DB0', '#CED6D3'],
  //     },
  //     tooltip: {
  //       theme: 'dark',
  //       marker: {
  //         show: true,
  //       },
  //       x: {
  //         show: true,
  //       },
  //     },
  //   };
  // }
  // private chart3() {
  //   this.earningOptions = {
  //     series: [
  //       {
  //         name: '2019',
  //         data: [15, 48, 36, 20, 40, 60, 35, 20, 16, 31, 22, 11],
  //       },
  //       {
  //         name: '2018',
  //         data: [8, 22, 60, 35, 17, 24, 48, 37, 56, 22, 32, 38],
  //       },
  //     ],
  //     chart: {
  //       height: 240,
  //       type: 'line',
  //       zoom: {
  //         enabled: false,
  //       },
  //       toolbar: {
  //         show: false,
  //       },
  //     },
  //     dataLabels: {
  //       enabled: false,
  //     },
  //     stroke: {
  //       width: 3,
  //       curve: 'smooth',
  //       dashArray: [0, 8],
  //     },
  //     colors: ['#8793ea', '#4caf50'],
  //     fill: {
  //       opacity: [1, 0.5],
  //     },
  //     markers: {
  //       size: 0,
  //       hover: {
  //         sizeOffset: 6,
  //       },
  //     },
  //     xaxis: {
  //       categories: [
  //         'Jan',
  //         'Feb',
  //         'Mar',
  //         'Apr',
  //         'May',
  //         'Jun',
  //         'Jul',
  //         'Aug',
  //         'Sep',
  //         'Oct',
  //         'Nov',
  //         'Dec',
  //       ],
  //       labels: {
  //         style: {
  //           colors: '#8e8da4',
  //         },
  //       },
  //     },
  //     yaxis: {
  //       labels: {
  //         style: {
  //           colors: '#8e8da4',
  //         },
  //       },
  //     },
  //     grid: {
  //       show: true,
  //       borderColor: '#9aa0ac',
  //       strokeDashArray: 1,
  //     },
  //     tooltip: {
  //       theme: 'dark',
  //     },
  //   };
  // }

  // private chart4() {
  //   this.performanceRateChartOptions = {
  //     series: [
  //       {
  //         name: 'Bill Amount',
  //         data: [113, 120, 130, 120, 125, 119, 126],
  //       },
  //     ],
  //     chart: {
  //       height: 380,
  //       type: 'line',
  //       dropShadow: {
  //         enabled: true,
  //         color: '#000',
  //         top: 18,
  //         left: 7,
  //         blur: 10,
  //         opacity: 0.2,
  //       },
  //       foreColor: '#9aa0ac',
  //       toolbar: {
  //         show: false,
  //       },
  //     },
  //     colors: ['#6777EF'],
  //     dataLabels: {
  //       enabled: true,
  //     },
  //     stroke: {
  //       curve: 'smooth',
  //     },
  //     markers: {
  //       size: 1,
  //     },
  //     xaxis: {
  //       categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  //       title: {
  //         text: 'Weekday',
  //       },
  //     },
  //     yaxis: {
  //       title: {
  //         text: 'Bill Amount($)',
  //       },
  //     },
  //     grid: {
  //       show: true,
  //       borderColor: '#9aa0ac',
  //       strokeDashArray: 1,
  //     },
  //     tooltip: {
  //       theme: 'dark',
  //       marker: {
  //         show: true,
  //       },
  //       x: {
  //         show: true,
  //       },
  //     },
  //   };
  // }

  // // TODO start
  // tasks = [
  //   {
  //     id: '1',
  //     title: 'Submit Science Homework',
  //     done: true,
  //     priority: 'High',
  //   },
  //   {
  //     id: '2',
  //     title: 'Request for festivle holiday',
  //     done: false,
  //     priority: 'High',
  //   },
  //   {
  //     id: '3',
  //     title: 'Order new java book',
  //     done: false,
  //     priority: 'Low',
  //   },
  //   {
  //     id: '4',
  //     title: 'Remind for lunch in hotel',
  //     done: true,
  //     priority: 'Normal',
  //   },
  //   {
  //     id: '5',
  //     title: 'Pay Hostel Fees',
  //     done: false,
  //     priority: 'High',
  //   },
  //   {
  //     id: '6',
  //     title: 'Attend Seminar On Sunday',
  //     done: false,
  //     priority: 'Normal',
  //   },
  //   {
  //     id: '7',
  //     title: 'Renew bus pass',
  //     done: true,
  //     priority: 'High',
  //   },
  //   {
  //     id: '8',
  //     title: 'Issue book in library',
  //     done: false,
  //     priority: 'High',
  //   },
  //   {
  //     id: '9',
  //     title: 'Project report submit',
  //     done: false,
  //     priority: 'Low',
  //   },
  // ];

  // drop(event: CdkDragDrop<string[]>) {
  //   moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);
  // }

  // toggle(task: { done: boolean }) {
  //   task.done = !task.done;
  // }
  // TODO end

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }

  onIconClick(event: MouseEvent, transactionType: string) {
    event.stopPropagation(); // Prevent event bubbling

    console.log(`Icon clicked - Type: ${transactionType}`);
    var urlLink="";
    var actionId="pending";
    var module={};
    var criteria :any={};
    var pageStateType='';
    switch(transactionType)
    {
      case this.translatedLangText.IN_GATE_SURVEY_PENDING: 
        module={ queryParams: { tabIndex: 'app-in-gate-survey' } };
        pageStateType = 'InGateSurvey';
        criteria.eir_status_cv=[ 'YET_TO_SURVEY'];
        urlLink="admin/inventory/in-gate-main";
      break;
      case this.translatedLangText.OUT_GATE_SURVEY_PENDING: 
        module={ queryParams: { tabIndex: 'out-gate-survey' } };
        pageStateType = 'OutGateSurvey';
        criteria.eir_status_cv=[ 'YET_TO_SURVEY'];
        urlLink="admin/inventory/out-gate-main";
      break;
      case this.translatedLangText.GATE_IN_PENDING: 
        module={ queryParams: { tabIndex: 'app-in-gate' } };
        pageStateType = 'InGate';
        //criteria.status_cv=[ 'YET_TO_SURVEY']
        urlLink="admin/inventory/in-gate-main";
      break;
      case this.translatedLangText.ESTIMATE_CUSTOMER_APPROVAL_PENDING: 
        pageStateType = 'RepairApproval';
        criteria.est_status_cv=['PENDING'];
        criteria.repair_option_cv=["OFFHIRE","REPAIR"];
        urlLink="admin/repair/approval";
      break;
      case this.translatedLangText.REPAIR_ESTIMATE_PENDING:
        pageStateType = 'RepairEstimate';
        criteria.est_pending=true;
        urlLink="admin/repair/estimate";
      break;
      case this.translatedLangText.REPAIR_QC_PENDING: 
        module={ queryParams: { tabIndex: 'app-job-qc' } };
        pageStateType = 'RepairQC';
         criteria.jobStatusCv=['COMPLETED'];
        urlLink="admin/repair/job-order";
      break;
      case this.translatedLangText.CLEANING_PENDING: 
        criteria.approval_status=["APPROVED"];
        pageStateType = 'CleaningApproval';
       urlLink="admin/cleaning/approval";
      break;
      case this.translatedLangText.RESIDUE_PENDING: 
        pageStateType = 'ResidueDisposalEstimateApproval'
        criteria.est_status_cv=["PENDING","APPROVED"];
        urlLink="admin/residue-disposal/estimate-approval/"
      break;
      case this.translatedLangText.STEAMING_PENDING:
        pageStateType = 'SteamEstimateApproval'
        criteria.est_status_cv=["PENDING","APPROVED"];
        urlLink="admin/steam/estimate-approval/";
        break;
      case this.translatedLangText.TANK_PERIODIC_TEST_DUE:
        const today = new Date();
        const pastLimit = new Date(today);
        pastLimit.setFullYear(today.getFullYear() - 2);
        pastLimit.setMonth(pastLimit.getMonth() - 6); // 0.5 year = 6 months
        var dueDt=Utility.convertDate(pastLimit,true,true);
        criteria.test_dt=dueDt;
        pageStateType = 'PeriodicTest'
        actionId="due";
        urlLink="admin/survey/periodic-test/";
      break;
      case this.translatedLangText.CLEANING_KIV:
         pageStateType = 'CleaningApproval';
         criteria.approval_status=["KIV"];
         actionId="kiv";
         urlLink="admin/cleaning/approval";
      break;
      case this.translatedLangText.RELEASE_PENDING:
        const tdy = new Date();
        const limit = new Date(tdy);
        limit.setDate(limit.getDate() + 3); // 0.5 year = 6 months
        var dueDt=Utility.convertDate(limit,true,true);
        pageStateType = 'ReleaseOrder'
        criteria.due_dt=dueDt;
        urlLink="admin/inventory/release-order";
      break;
      case this.translatedLangText.GATE_OUT_PUBLISH_PENDING:
        actionId="publish";
        module={ queryParams: { tabIndex: 'out-gate-survey' } };
        pageStateType = 'OutGateSurvey';
        criteria.eir_status_cv=[ 'PENDING'];
        urlLink="admin/inventory/out-gate-main";
      break;
      case this.translatedLangText.GATE_IN_PUBLISH_PENDING:
        actionId="publish";
        module={ queryParams: { tabIndex: 'app-in-gate-survey' } };
        pageStateType = 'InGateSurvey';
        criteria.eir_status_cv=[ 'PENDING'];
        urlLink="admin/inventory/in-gate-main";
      break;
      // case this.translatedLangText.GATEIO_PENDING: 

      // break;
    }
    if(urlLink)
    {
      var pageSize = pageSizeInfo.defaultSize ;
      var pageIndex =0; var first = pageSize; var after = undefined;
      var last = undefined;var before = undefined;

      this.searchStateService.setPagination(pageStateType, 
      {pageSize, pageIndex, first, after,  last, before});

      this.searchStateService.setCriteria(pageStateType, criteria);
      this.router.navigate([`${urlLink}`],module);
     }
    // // Add your custom logic here
    // this.showTransactionDetails(transactionType, amount);

    // // Optional: Add visual feedback
    // const iconBox = event.target as HTMLElement;
    // iconBox.classList.add('icon-clicked');
    // setTimeout(() => iconBox.classList.remove('icon-clicked'), 200);
  }

  AllowToView(cardName: string) {
    var retval: boolean = false;;
    switch (cardName) {
      case this.translatedLangText.IN_GATE_SURVEY_PENDING:
        retval = this.modulePackageService.hasFunctions(['DASHBOARD_PENDING_IN_SURVEY_VIEW', 'EXCLUSIVE_DASHBOARD_VIEW']);
        break;
      case this.translatedLangText.OUT_GATE_SURVEY_PENDING:
        retval = this.modulePackageService.hasFunctions(['DASHBOARD_PENDING_OUT_SURVEY_VIEW', 'EXCLUSIVE_DASHBOARD_VIEW']);
        break;
      case this.translatedLangText.GATE_IN_PENDING:
        retval = this.modulePackageService.hasFunctions(['DASHBOARD_PENDING_GATE_IN_VIEW', 'EXCLUSIVE_DASHBOARD_VIEW']);
        break;
      case this.translatedLangText.ESTIMATE_CUSTOMER_APPROVAL_PENDING:
        retval = this.modulePackageService.hasFunctions(['DASHBOARD_PENDING_APPROVAL_VIEW', 'EXCLUSIVE_DASHBOARD_VIEW']);
        break;
      case this.translatedLangText.REPAIR_ESTIMATE_PENDING:
        retval = this.modulePackageService.hasFunctions(['DASHBOARD_PENDING_ESTIMATE_VIEW', 'EXCLUSIVE_DASHBOARD_VIEW']);
        break;
      case this.translatedLangText.REPAIR_QC_PENDING:
        retval = this.modulePackageService.hasFunctions(['EXCLUSIVE_DASHBOARD_VIEW']);
        break;
      case this.translatedLangText.CLEANING_PENDING:
        retval = this.modulePackageService.hasFunctions(['DASHBOARD_PENDING_CLEANING_VIEW', 'EXCLUSIVE_DASHBOARD_VIEW']);
        break;
      case this.translatedLangText.RESIDUE_PENDING:
        retval = this.modulePackageService.hasFunctions(['DASHBOARD_PENDING_RESIDUE_VIEW', 'EXCLUSIVE_DASHBOARD_VIEW']);
        break;
      case this.translatedLangText.GATEIO:
        retval = this.modulePackageService.hasFunctions(['DASHBOARD_PENDING_GATE_IN_VIEW', 'DASHBOARD_PENDING_GATE_OUT_VIEW', 'EXCLUSIVE_DASHBOARD_VIEW']);
        break;
      case this.translatedLangText.TANK_IN_YARD:
        retval = this.modulePackageService.hasFunctions(['DASHBOARD_PENDING_IN_YARD_VIEW', 'EXCLUSIVE_DASHBOARD_VIEW']);
        break;
      case this.translatedLangText.STEAMING_PENDING:
        retval = this.modulePackageService.hasFunctions(['DASHBOARD_PENDING_STEAMING_VIEW', 'EXCLUSIVE_DASHBOARD_VIEW']);
        break;
      case this.translatedLangText.TANK_PERIODIC_TEST_DUE:
        retval = this.modulePackageService.hasFunctions(['DASHBOARD_DUE_PERIODIC_TEST_VIEW', 'EXCLUSIVE_DASHBOARD_VIEW']);
        break;
      case this.translatedLangText.CLEANING_KIV:
        retval = this.modulePackageService.hasFunctions(['DASHBOARD_KIV_CLEANING_VIEW', 'EXCLUSIVE_DASHBOARD_VIEW']);
        break;
      case this.translatedLangText.RELEASE_PENDING:
        retval = this.modulePackageService.hasFunctions(['DASHBOARD_PENDING_RELEASE_ORDER_VIEW', 'EXCLUSIVE_DASHBOARD_VIEW']);
        break;
      case this.translatedLangText.GATE_OUT_PUBLISH_PENDING:
        retval = this.modulePackageService.hasFunctions(['DASHBOARD_PENDING_RELEASE_ORDER_VIEW', 'EXCLUSIVE_DASHBOARD_VIEW']);
        break;
      case this.translatedLangText.GATE_IN_PUBLISH_PENDING:
        retval = this.modulePackageService.hasFunctions(['DASHBOARD_PENDING_RELEASE_ORDER_VIEW', 'EXCLUSIVE_DASHBOARD_VIEW']);
        break;
    }
    return retval;
  }



}
