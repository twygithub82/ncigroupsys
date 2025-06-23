import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { ModulePackageService } from 'app/services/module-package.service';
import { Utility } from 'app/utilities/utility';
import { InGateSurveyComponent } from './in-gate-survey/in-gate-survey.component';
import { InGateComponent } from './in-gate/in-gate.component';
import { GlobalMaxCharDirective } from 'app/directive/global-max-char.directive';
import { SearchStateService } from 'app/services/search-criteria.service';

@Component({
  selector: 'app-in-gate-main',
  standalone: true,
  templateUrl: './in-gate-main.component.html',
  styleUrl: './in-gate-main.component.scss',
  imports: [
    BreadcrumbComponent,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    MatRippleModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    TranslateModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatAutocompleteModule,
    MatDividerModule,
    MatTabsModule,
    InGateComponent,
    InGateSurveyComponent
  ]
})
export class InGateMainComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  pageTitle = 'MENUITEMS.INVENTORY.LIST.IN-GATE'
  breadcrumsMiddleList = [
    { text: 'MENUITEMS.INVENTORY.TEXT', route: '/admin/inventory/in-gate-main', queryParams: { tabIndex: "app-in-gate" } }
  ]

  translatedLangText: any = {};
  langText = {
    STATUS: 'COMMON-FORM.STATUS',
    SO_NO: 'COMMON-FORM.SO-NO',
    CUSTOMER: 'COMMON-FORM.CUSTOMER',
    SO_DATE: 'COMMON-FORM.SO-DATE',
    NO_OF_TANKS: 'COMMON-FORM.NO-OF-TANKS',
    LAST_CARGO: 'COMMON-FORM.LAST-CARGO',
    TANK_NO: 'COMMON-FORM.TANK-NO',
    JOB_NO: 'COMMON-FORM.JOB-NO',
    PURPOSE: 'COMMON-FORM.PURPOSE',
    ETA_DATE: 'COMMON-FORM.ETA-DATE',
    NO_RESULT: 'COMMON-FORM.NO-RESULT',
    ARE_YOU_SURE_CANCEL: 'COMMON-FORM.ARE-YOU-SURE-CANCEL',
    CANCEL: 'COMMON-FORM.CANCEL',
    CLOSE: 'COMMON-FORM.CLOSE',
    TO_BE_CANCELED: 'COMMON-FORM.TO-BE-CANCELED',
    CANCELED_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
    SEARCH: "COMMON-FORM.SEARCH",
    IN_GATE: "COMMON-FORM.IN-GATE",
    IN_GATE_SURVEY: "COMMON-FORM.IN-GATE-SURVEY"
  }

  @ViewChild('inGateComp', { static: false }) inGateComp?: InGateComponent;
  @ViewChild('inGateSurveyComp', { static: false }) inGateSurveyComp?: InGateSurveyComponent;

  tabConfig = [
    {
      label: this.translatedLangText.IN_GATE,
      component: 'app-in-gate',
      modulePackage: ['growth', 'customized'],
      expectedFunctions: ['INVENTORY_IN_GATE_VIEW', 'INVENTORY_IN_GATE_EDIT', 'INVENTORY_IN_GATE_DELETE'],
      componentRef: this.inGateComp
    },
    {
      label: this.translatedLangText.IN_GATE_SURVEY,
      component: 'app-in-gate-survey',
      modulePackage: ['starter', 'growth', 'customized'],
      expectedFunctions: ['INVENTORY_IN_GATE_SURVEY_VIEW', 'INVENTORY_IN_GATE_SURVEY_EDIT', 'INVENTORY_IN_GATE_SURVEY_DELETE', 'INVENTORY_IN_GATE_SURVEY_PUBLISH'],
      componentRef: this.inGateSurveyComp
    }
  ];

  get allowedTabs() {
    return this.tabConfig.filter(tab => {
      return this.modulePackageService.hasFunctions(tab.expectedFunctions)
    });
  }

  selectedTabIndex = 0;
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private modulePackageService: ModulePackageService,) {
    super();
    this.translateLangText();

  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const tabComponent = params['tabIndex'];
      const index = this.allowedTabs.findIndex(t => t.component === tabComponent);
      this.selectedTabIndex = index >= 0 ? index : 0;
      // this.tabComponent=tabComponent
    });

  }
  // ngAfterViewInit(){
  //   // this.route.queryParams.subscribe(params => {
  //   //   const tabComponent = params['tabIndex'];
  //   //   const index = this.allowedTabs.findIndex(t => t.component === tabComponent);
  //   //   this.selectedTabIndex = index >= 0 ? index : 0;
  //     this.loadData(this.tabComponent);
  //   // });
  // }

  onTabChange(index: number): void {
    const tabComponent = this.allowedTabs[index];
    if (tabComponent) {
      this.router.navigate([], {
        queryParams: { tabIndex: tabComponent?.component },
        queryParamsHandling: 'merge'
      });

      switch (tabComponent.component) {
        case 'app-in-gate':
          this.inGateComp?.onTabFocused(); // example method
          break;
        case 'app-in-gate-survey':
          this.inGateSurveyComp?.onTabFocused(); // example method
          break;
      }
    }
  }

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }

  // loadData(tabName:String)
  // {
  //   var actionId= this.route.snapshot.paramMap.get('id');
  //   if(actionId==="pending")
  //   {

  //    if (tabName === "app-in-gate" && this.inGateComp) {
  //     this.inGateComp.loadData_Pending();
  //   } else if (tabName === "app-in-gate-survey" && this.inGateSurveyComp) {
  //     this.inGateSurveyComp.loadData_Pending();
  //   }

  //   }
  // }
}