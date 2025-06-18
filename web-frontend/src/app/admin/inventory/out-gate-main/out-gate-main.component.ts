import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { ModulePackageService } from 'app/services/module-package.service';
import { Utility } from 'app/utilities/utility';
import { OutGateSurveyComponent } from './out-gate-survey/out-gate-survey.component';
import { OutGateComponent } from './out-gate/out-gate.component';

@Component({
  selector: 'app-in-gate-main',
  standalone: true,
  templateUrl: './out-gate-main.component.html',
  styleUrl: './out-gate-main.component.scss',
  imports: [
    BreadcrumbComponent,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatRippleModule,
    TranslateModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDividerModule,
    MatTabsModule,
    OutGateComponent,
    OutGateSurveyComponent
  ]
})
export class OutGateMainComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  pageTitle = 'MENUITEMS.INVENTORY.LIST.OUT-GATE'
  breadcrumsMiddleList = [
    { text: 'MENUITEMS.INVENTORY.TEXT', route: '/admin/inventory/out-gate-main', queryParams: { tabIndex: "out-gate" } }
  ]

  readonly tabs = ['out-gate', 'out-gate-survey'];

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
    OUT_GATE: "COMMON-FORM.OUT-GATE",
    OUT_GATE_SURVEY: "COMMON-FORM.OUT-GATE-SURVEY"
  }

  selectedTabIndex = 0;

  @ViewChild('outGateComp') outGateComp?: OutGateComponent;
  @ViewChild('outGateSurveyComp') outGateSurveyComp?: OutGateSurveyComponent;
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    public modulePackageService: ModulePackageService
  ) {
    super();
    this.translateLangText();
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const tabName = params['tabIndex'];
      const index = this.tabs.indexOf(tabName);
      this.selectedTabIndex = index >= 0 ? index : 0;
    });
  }

  onTabChange(index: number) {
    const tabName = this.tabs[index];
    this.router.navigate([], {
      queryParams: { tabIndex: tabName },
      queryParamsHandling: 'merge',
    });
  }

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }

  onTabSelected(event: MatTabChangeEvent): void {
    console.log(`Selected Index: ${event.index}, Tab Label: ${event.tab.textLabel}`);
    switch (event.index) {

      case 0:
        this.outGateComp?.onTabFocused(); break;
      case 1:
        this.outGateSurveyComp?.onTabFocused(); break;

    }
  }

  tabConfig = [
    {
      label: this.translatedLangText.OUT_GATE,
      component: 'app-out-gate',
      modulePackage: ['starter', 'growth', 'customized']
    },
    {
      label: this.translatedLangText.OUT_GATE_SURVEY,
      component: 'app-out-gate-survey',
      modulePackage: ['starter', 'growth', 'customized']
    }
  ];

  get allowedTabs() {
    return this.tabConfig.filter(tab =>
      tab.modulePackage.includes(this.modulePackageService.getModulePackage())
    );
  }

}