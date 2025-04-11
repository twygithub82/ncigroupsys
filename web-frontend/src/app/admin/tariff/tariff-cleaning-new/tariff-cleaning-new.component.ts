import { Direction } from '@angular/cdk/bidi';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { Utility } from 'app/utilities/utility';
import { HttpClientModule } from '@angular/common/http';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { FileManagerService } from '@core/service/filemanager.service';
import { Apollo } from 'apollo-angular';
import { CleaningCategoryDS, CleaningCategoryItem } from 'app/data-sources/cleaning-category';
import { CleaningMethodDS, CleaningMethodItem } from 'app/data-sources/cleaning-method';
import { CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { CustomerCompanyItem } from 'app/data-sources/customer-company';
import { StoringOrderDS } from 'app/data-sources/storing-order';
import { ClassNoItem, TariffCleaningDS, TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { ComponentUtil } from 'app/utilities/component-util';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { FormDialogComponent } from './form-dialog/form-dialog.component';
import { MessageDialogComponent } from '@shared/components/message-dialog/message-dialog.component';
import { PreventNonNumericDirective } from 'app/directive/prevent-non-numeric.directive';


@Component({
  selector: 'app-tariff-cleaning-new',
  standalone: true,
  templateUrl: './tariff-cleaning-new.component.html',
  styleUrl: './tariff-cleaning-new.component.scss',
  imports: [
    BreadcrumbComponent,
    MatButtonModule,
    MatSidenavModule,
    MatTooltipModule,
    MatIconModule,
    MatFormFieldModule,
    MatTabsModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    TranslateModule,
    CommonModule,
    MatLabel,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatDividerModule,
    MatMenuModule,
    HttpClientModule,
    PreventNonNumericDirective
  ]
})

export class TariffCleaningNewComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  displayedColumns = [
    'select',
    // 'tank_no',
    //'tank_no_validity',
    // 'last_cargo',
    // 'job_no',
    // 'purpose_storage',
    // 'purpose_cleaning',
    // 'purpose_steam',
    // 'purpose_repair_cv',
    // 'status_cv',
    // 'certificate_cv',
    // 'actions'
  ];

  maxFileSizeInMB: number = 20; // Maximum file size in MB
  fileSizeError: string | null = null;


  pageTitleNew = 'MENUITEMS.TARIFF.LIST.TARIFF-CLEANING-NEW'
  pageTitleEdit = 'MENUITEMS.TARIFF.LIST.TARIFF-CLEANING-EDIT'
  breadcrumsMiddleList = [
    { text: 'MENUITEMS.TARIFF.TEXT', route: '/admin/tariff/tariff-cleaning' },
    { text: 'MENUITEMS.TARIFF.LIST.TARIFF-CLEANING', route: '/admin/tariff/tariff-cleaning' }
  ]
  translatedLangText: any = {}
  langText = {
    NEW: 'COMMON-FORM.NEW',
    EDIT: 'COMMON-FORM.EDIT',
    HEADER: 'COMMON-FORM.CARGO-DETAILS',
    HEADER_OTHER: 'COMMON-FORM.CARGO-OTHER-DETAILS',
    CUSTOMER_CODE: 'COMMON-FORM.CUSTOMER-CODE',
    SO_NO: 'COMMON-FORM.SO-NO',
    SO_NOTES: 'COMMON-FORM.SO-NOTES',
    HAULIER: 'COMMON-FORM.HAULIER',
    ORDER_DETAILS: 'COMMON-FORM.ORDER-DETAILS',
    UNIT_TYPE: 'COMMON-FORM.UNIT-TYPE',
    TANK_NO: 'COMMON-FORM.TANK-NO',
    PURPOSE: 'COMMON-FORM.PURPOSE',
    STORAGE: 'COMMON-FORM.STORAGE',
    STEAM: 'COMMON-FORM.STEAM',
    CLEANING: 'COMMON-FORM.CLEANING',
    REPAIR: 'COMMON-FORM.REPAIR',
    LAST_CARGO: 'COMMON-FORM.LAST-CARGO',
    CLEAN_STATUS: 'COMMON-FORM.CLEAN-STATUS',
    CERTIFICATE: 'COMMON-FORM.CERTIFICATE',
    REQUIRED_TEMP: 'COMMON-FORM.REQUIRED-TEMP',
    FLASH_POINT: 'COMMON-FORM.FLASH-POINT',
    JOB_NO: 'COMMON-FORM.JOB-NO',
    ETA_DATE: 'COMMON-FORM.ETA-DATE',
    REMARKS: 'COMMON-FORM.REMARKS',
    ETR_DATE: 'COMMON-FORM.ETR-DATE',
    ST: 'COMMON-FORM.ST',
    O2_LEVEL: 'COMMON-FORM.O2-LEVEL',
    OPEN_ON_GATE: 'COMMON-FORM.OPEN-ON-GATE',
    SO_REQUIRED: 'COMMON-FORM.IS-REQUIRED',
    STATUS: 'COMMON-FORM.STATUS',
    UPDATE: 'COMMON-FORM.UPDATE',
    CANCEL: 'COMMON-FORM.CANCEL',
    STORING_ORDER: 'MENUITEMS.INVENTORY.LIST.STORING-ORDER',
    NO_RESULT: 'COMMON-FORM.NO-RESULT',
    SAVE_SUCCESS: 'COMMON-FORM.SAVE-SUCCESS',
    BACK: 'COMMON-FORM.BACK',
    SAVE_AND_SUBMIT: 'COMMON-FORM.SAVE-AND-SUBMIT',
    ARE_YOU_SURE_DELETE: 'COMMON-FORM.ARE-YOU-SURE-DELETE',
    DELETE: 'COMMON-FORM.DELETE',
    CLOSE: 'COMMON-FORM.CLOSE',
    INVALID: 'COMMON-FORM.INVALID',
    EXISTED: 'COMMON-FORM.EXISTED',
    DUPLICATE: 'COMMON-FORM.DUPLICATE',
    SELECT_ATLEAST_ONE: 'COMMON-FORM.SELECT-ATLEAST-ONE',
    ADD_ATLEAST_ONE: 'COMMON-FORM.ADD-ATLEAST-ONE',
    ROLLBACK_STATUS: 'COMMON-FORM.ROLLBACK-STATUS',
    CANCELED_SUCCESS: 'COMMON-FORM.CANCELED-SUCCESS',
    ARE_YOU_SURE_CANCEL: 'COMMON-FORM.ARE-YOU-SURE-CANCEL',
    ARE_YOU_SURE_ROLLBACK: 'COMMON-FORM.ARE-YOU-SURE-ROLLBACK',
    BULK: 'COMMON-FORM.BULK',
    CONFIRM: 'COMMON-FORM.CONFIRM',
    UNDO: 'COMMON-FORM.UNDO',
    CARGO_NAME: 'COMMON-FORM.CARGO-NAME',
    CARGO_ALIAS: 'COMMON-FORM.CARGO-ALIAS',
    CARGO_DESCRIPTION: 'COMMON-FORM.CARGO-DESCRIPTION',
    CARGO_CLASS: 'COMMON-FORM.CARGO-CLASS',
    CARGO_CLASS_SELECT: 'COMMON-FORM.CARGO-CLASS-SELECT',
    CARGO_UN_NO: 'COMMON-FORM.CARGO-UN-NO',
    CARGO_METHOD: 'COMMON-FORM.CARGO-METHOD',
    CARGO_CATEGORY: 'COMMON-FORM.CARGO-CATEGORY',
    CARGO_FLASH_POINT: 'COMMON-FORM.CARGO-FLASH-POINT',
    CARGO_COST: 'COMMON-FORM.CARGO-COST',
    CARGO_HAZARD_LEVEL: 'COMMON-FORM.CARGO-HAZARD-LEVEL',
    CARGO_BAN_TYPE: 'COMMON-FORM.CARGO-BAN-TYPE',
    CARGO_NATURE: 'COMMON-FORM.CARGO-NATURE',
    CARGO_REQUIRED: 'COMMON-FORM.IS-REQUIRED',
    CARGO_ALERT: 'COMMON-FORM.IN-GATE-ALERT',
    CARGO_NOTE: 'COMMON-FORM.CARGO-NOTE',
    CARGO_CLASS_1: "COMMON-FORM.CARGO-CALSS-1",
    CARGO_CLASS_1_4: "COMMON-FORM.CARGO-CALSS-1-4",
    CARGO_CLASS_1_5: "COMMON-FORM.CARGO-CALSS-1-5",
    CARGO_CLASS_1_6: "COMMON-FORM.CARGO-CALSS-1-6",
    CARGO_CLASS_2_1: "COMMON-FORM.CARGO-CALSS-2-1",
    CARGO_CLASS_2_2: "COMMON-FORM.CARGO-CALSS-2-2",
    CARGO_CLASS_2_3: "COMMON-FORM.CARGO-CALSS-2-3",
    ATTACHMENT_TOO_BIG: "COMMON-FORM.ATTACHMENT-TOO-BIG",
    SDS_FILE: "COMMON-FORM.SDS-FILE",
    DUPLICATE_CARGO_FOUND: 'COMMON-FORM.DUPLICATE-CARGO-FOUND',
    WARNING: 'COMMON-FORM.WARNING',
  }

  historyState: any = {};

  sdsFiles: (string | ArrayBuffer)[] = [];
  cCategoryList: CleaningCategoryItem[] = [];
  cMethodList: CleaningMethodItem[] = [];
  tcList: TariffCleaningItem[] = [];
  classNoCvList: CodeValuesItem[] = [];
  banTypeCvList: CodeValuesItem[] = [];
  hazardLevelCvList: CodeValuesItem[] = [];
  natureCvList: CodeValuesItem[] = [];
  openGateCvList: CodeValuesItem[] = [];


  classNoControl = new UntypedFormControl();
  methodControl = new UntypedFormControl();
  categoryControl = new UntypedFormControl();
  banTypeControl = new UntypedFormControl();
  hazardLevelControl = new UntypedFormControl();
  openGateControl = new UntypedFormControl();
  natureControl = new UntypedFormControl();
  tcForm?: UntypedFormGroup;

  tariffCleaningItem: TariffCleaningItem = new TariffCleaningItem();
  existingClassNos: ClassNoItem[] = [];
  tc_guid?: string | null;

  cvDS: CodeValuesDS;
  soDS: StoringOrderDS;
  tcDS: TariffCleaningDS;
  tcUNDS: TariffCleaningDS;

  cCategoryDS: CleaningCategoryDS;
  cMethodDS: CleaningMethodDS;

  selectedFileLoading: BehaviorSubject<boolean>; // Declare as Observable<boolean>
  submitForSaving: BehaviorSubject<boolean>;
  private loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  selectedFileChanged: boolean = false;
  newUNNo: boolean = true;
  selectedFile: File | null = null;
  existingSDSFiles: File[] | null = null;
  existingSDSFilesUrls: any[] | null = null;



  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  prefix = 'UN';
  sdsFileLoading: boolean = false;
  trfCleaningSubmitting: boolean = false;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private fileManagerService: FileManagerService
  ) {
    super();
    this.translateLangText();
    // this.loadData();
    this.initTcForm();
    this.soDS = new StoringOrderDS(this.apollo);
    this.tcDS = new TariffCleaningDS(this.apollo);
    this.tcUNDS = new TariffCleaningDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.cCategoryDS = new CleaningCategoryDS(this.apollo);
    this.cMethodDS = new CleaningMethodDS(this.apollo);
    this.selectedFileLoading = new BehaviorSubject<boolean>(false);
    this.submitForSaving = new BehaviorSubject<boolean>(false);


  }


  initTcForm() {
    this.tcForm = this.fb.group({
      guid: [{ value: '' }],
      cargo_name: [''],
      cargo_alias: [''],
      cargo_description: [''],
      class_no: this.classNoControl,
      method: this.methodControl,
      category: this.categoryControl,
      hazard_level: this.hazardLevelControl,
      ban_type: this.banTypeControl,
      open_gate: this.openGateControl,
      flash_point: [''],
      un_no: ['', [Validators.required, this.onlyNumbersDashValidator]],
      nature: this.natureCvList,
      in_gate_alert: [''],
      depot_note: [''],
      sds_file: [null],
      file_size: [0, [Validators.required, this.onlyFileSizeValidator]],
      remarks: ['']
    });
  }

  ngOnInit() {
    //this.initializeFilter();


    this.tcForm!.get('un_no')?.valueChanges.subscribe(value => {

      if (value && !value.startsWith(this.prefix) && value != '-') {
        // Remove existing prefix before adding a new one
        const numericPart = value.replace(/[^0-9]/g, ''); // Extract numeric part of the value
        if (numericPart && !isNaN(Number(numericPart))) {
          const newValue = this.prefix + value.replace(this.prefix, '');
          this.tcForm!.get('un_no')?.setValue(newValue, { emitEvent: false });
        }
      }

      this.CheckUnNoValidity();
    });
    this.loadData();
  }

  populatetcForm(tc: TariffCleaningItem): void {
    //this.tcForm!.patchValue({
    this.tcForm = this.fb.group({
      guid: tc.guid,
      cargo_name: tc.cargo,
      cargo_alias: tc.alias,
      cargo_description: tc.description,
      class_no: { value: tc.class_cv, disabled: false },
      method: { value: tc.cleaning_method_guid, disabled: false },
      category: { value: tc.cleaning_category_guid, disabled: false },
      hazard_level: { value: tc.hazard_level_cv, disabled: false },
      ban_type: { value: tc.ban_type_cv, disabled: false },

      open_gate: { value: tc.open_on_gate_cv, disabled: false },
      flash_point: tc.flash_point,
      un_no: [tc.un_no, [Validators.required, this.onlyNumbersDashValidator]],
      nature: { value: tc.nature_cv, disabled: false },
      in_gate_alert: tc.in_gate_alert,
      depot_note: tc.depot_note,
      sds_file: [''],
      file_size: [0, [Validators.required, this.onlyFileSizeValidator]],
      remarks: tc.remarks
    });


  }

  public loadData() {
    this.cCategoryDS.loadItems({ name: { neq: null } }, { sequence: 'ASC' }).subscribe(data => {
      if (this.cCategoryDS.totalCount > 0) {
        this.cCategoryList = data;
      }

    });

    this.cMethodDS.loadItems({ name: { neq: null } }, { sequence: 'ASC' },100).subscribe(data => {
      if (this.cMethodDS.totalCount > 0) {
        this.cMethodList = data;
      }

    });

    const queries = [
      { alias: 'ctHazardLevelCv', codeValType: 'HAZARD_LEVEL' },
      { alias: 'classNoCv', codeValType: 'CLASS_NO' },
      { alias: 'banTypeCv', codeValType: 'BAN_TYPE' },
      { alias: 'openGateCv', codeValType: 'YES_NO' },
      { alias: 'natureCv', codeValType: 'NATURE_TYPE' },
    ];
    this.cvDS.getCodeValuesByType(queries);
    this.cvDS.connectAlias('ctHazardLevelCv').subscribe(data => {
      this.hazardLevelCvList = data;
      // this.hazardLevelCvList = addDefaultSelectOption(this.soStatusCvList, 'All');
    });
    this.cvDS.connectAlias('classNoCv').subscribe(data => {
      this.classNoCvList = data;
    });
    this.cvDS.connectAlias('banTypeCv').subscribe(data => {
      this.banTypeCvList = data;
    });
    this.cvDS.connectAlias('openGateCv').subscribe(data => {
      this.openGateCvList = data;
    });
    this.cvDS.connectAlias('natureCv').subscribe(data => {
      this.natureCvList = data;
    });

    this.historyState = history.state;
    this.tc_guid = this.route.snapshot.paramMap.get('id');
    if (this.tc_guid) {
      {
        const where: any = {};
        where.guid = { eq: this.tc_guid };

        // EDIT
        this.subs.sink = this.tcDS.SearchTariffCleaning(where).subscribe(data => {
          if (this.tcDS.totalCount > 0) {
            this.tariffCleaningItem = data[0];
            this.populatetcForm(this.tariffCleaningItem);
            this.QueryAllFilesInGroup(this.tariffCleaningItem.guid!);

            this.tcForm!.get('un_no')?.valueChanges.subscribe(value => {

              if (value && !value.startsWith(this.prefix) && value != '-') {
                // Remove existing prefix before adding a new one
                const numericPart = value.replace(/[^0-9]/g, ''); // Extract numeric part of the value
                if (numericPart && !isNaN(Number(numericPart))) {
                  const newValue = this.prefix + value.replace(this.prefix, '');
                  this.tcForm!.get('un_no')?.setValue(newValue, { emitEvent: false });
                }
              }

              this.CheckUnNoValidity();
            });
            this.CheckUnNoValidity();
          }
        });

      }


    }


  }

  CheckUnNoValidity() {
    const regex = /^UN\d{4}$/;
    let isValid = regex.test(this.tcForm!.get('un_no')?.value);
    if (isValid) {
      this.QueryAllFilesInGroupAndClassNo();
    }
    else {

      this.tcForm!.patchValue({
        class_no: '',
      });
    }
  }
  onContextMenu(event: MouseEvent, item: any) {
    this.preventDefault(event);
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    if (this.contextMenu !== undefined && this.contextMenu.menu !== null) {
      this.contextMenu.menuData = { item: item };
      this.contextMenu.menu.focusFirstItem('mouse');
      this.contextMenu.openMenu();
    }
  }
  preventDefault(event: Event) {
    event.preventDefault(); // Prevents the form submission
  }
  stopEventTrigger(event: Event) {
    //this.preventDefault(event);
    this.stopPropagation(event);
  }


  stopPropagation(event: Event) {
    // event.stopPropagation(); // Stops event propagation
  }



  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }

  async onTCFormSubmit() {
    var fileSize = Number(this.tcForm!.get("file_size")?.value);
    if (fileSize == 0) {
      this.tcForm!.get("file_size")?.setErrors({ required: true });
    }

    //this.tcForm!.get('sotList')?.setErrors(null);
    //this.tcForm?.get('un_no')?.setErrors({ exited: false });
    if (this.tcForm?.valid) {
      // if (!this.sotList.data.length) {
      //   this.tcForm.get('sotList')?.setErrors({ required: true });
      // } else 
      // {
      this.trfCleaningSubmitting = true;
      this.submitForSaving.next(this.trfCleaningSubmitting);
      this.submitForSaving.subscribe(value => {
        if (value != this.trfCleaningSubmitting) this.submitForSaving.next(this.trfCleaningSubmitting);
      });
      let tc: TariffCleaningItem = new TariffCleaningItem(this.tariffCleaningItem);
      // tc.guid='';
      tc.cargo = this.tcForm.value['cargo_name'];
      tc.alias = this.tcForm.value['cargo_alias'];
      tc.description = this.tcForm.value['cargo_description'];
      tc.in_gate_alert = this.tcForm.value['in_gate_alert']?.toUpperCase();
      tc.depot_note = this.tcForm.value['depot_note'];;

      tc.class_cv = this.tcForm.value['class_no'];
      tc.cleaning_category_guid = this.tcForm.value['category'];
      tc.cleaning_method_guid = this.tcForm.value['method'];
      tc.hazard_level_cv = this.tcForm.value['hazard_level'];
      tc.ban_type_cv = this.tcForm.value['ban_type'];
      tc.open_on_gate_cv = this.tcForm.value['open_gate'];
      tc.flash_point = Number(this.tcForm.value['flash_point']);
      tc.un_no = this.tcForm.value['un_no'];
      tc.nature_cv = this.tcForm.value['nature'];
      tc.remarks = this.tcForm.value['remarks'];
      tc.cleaning_category = undefined;
      tc.cleaning_method = undefined;
      if (tc.guid) {
        var cargo_guid = await this.getTariffCleaningGuid(tc.cargo!);
        if (cargo_guid == tc.guid) {
          this.tcDS.updateTariffCleaning(tc).subscribe(async result => {
            console.log(result)
            var guid = tc.guid;
            await this.handleSaveSuccess(result?.data?.updateTariffClean, guid!);
            this.trfCleaningSubmitting = false;
            this.submitForSaving.next(this.trfCleaningSubmitting);

          });
        }
        else {
          this.ShowDuplicateCargoMessage();
        }
      }
      else {
        var cargo_guid = await this.getTariffCleaningGuid(tc.cargo!);
        if (cargo_guid == "") {
          this.tcDS.addNewTariffCleaning(tc).subscribe(async result => {
            console.log(result);
            var cargo_name = tc.cargo;
            var guid = await this.getTariffCleaningGuid(cargo_name!);
            await this.handleSaveSuccess(result?.data?.addTariffCleaning, guid!);
            this.trfCleaningSubmitting = false;
            this.submitForSaving.next(this.trfCleaningSubmitting);

          });
        }
        else {
          this.ShowDuplicateCargoMessage();
        }
      }



    }
    else {
      console.log('Invalid tcForm', this.tcForm?.value);
    }
  }

  async handleSaveSuccess(count: any, trfCleaning_guid: String) {
    if ((count ?? 0) > 0) {

      if (this.selectedFile) {
        var groupGuid: string = String(trfCleaning_guid);
        await this.onSubmit(groupGuid, 'tariff_cleaning');
      }
      let successMsg = this.langText.SAVE_SUCCESS;
      this.translate.get(this.langText.SAVE_SUCCESS).subscribe((res: string) => {
        successMsg = res;
        ComponentUtil.showNotification('snackbar-success', successMsg, 'top', 'center', this.snackBar);
        //this.router.navigate(['/admin/tariff/tariff-cleaning']);
        this.router.navigate(['/admin/tariff/tariff-cleaning'], {
          state: this.historyState

        }
        );

      });
    }
  }

  async getTariffCleaningGuid(cargo_name: string): Promise<string> {
    let retval: string = "";
    const where: any = {};

    where.cargo = { eq: cargo_name };

    try {
      // Use firstValueFrom to convert Observable to Promise
      const result = await firstValueFrom(this.tcDS.SearchTariffCleaning(where, {}));

      if (result.length > 0) {
        const r = result[0];
        retval = r.guid!;
      }
    } catch (error) {
      console.error("Error fetching tariff cleaning guid:", error);
    }

    return retval;
  }

  onlyFileSizeValidator(control: AbstractControl): { [key: string]: boolean } | null {
    //const regex = /^(UN)?[0-9-]*$/;
    if (control.value > 20) {
      return { 'error': true };
    }
    return null;
  }

  onlyNumbersDashValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const regex = /^(UN)?[0-9-]*$/;
    if (control.value && !regex.test(control.value)) {
      return { 'invalidCharacter': true };
    }

    return null;
  }

  displayCustomerCompanyFn(cc: CustomerCompanyItem): string {
    return cc && cc.code ? `${cc.code} (${cc.name})` : '';
    //return this.ccDS.displayName(cc);
  }

  displayCategoryFn(cCat: CleaningCategoryItem): string {
    return cCat && cCat.name ? `${cCat.name}` : '';
    //return this.ccDS.displayName(cc);
  }

  displayMethodFn(cMethod: CleaningMethodItem): string {
    return cMethod && cMethod.name ? `${cMethod.name}` : '';
    //return this.ccDS.displayName(cc);
  }

  displayCodeValueFn(cValue: CodeValuesItem): string {
    return cValue && cValue.code_val ? `${cValue.code_val}` : '';
    //return this.ccDS.displayName(cc);
  }

  selectClassNo(value: string): void {
    var codeValue = new CodeValuesItem();
    codeValue.code_val = value;
    this.classNoControl.setValue(codeValue);
  }


  addClassNo(event: Event) {
    this.preventDefault(event);  // Prevents the form submission
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        action: 'new',
        langText: this.langText,
        selectedValue: this.tcForm!.get("class_no")?.value
      }

    });


    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {


      if (result) {
        if (result.selectedValue) {

          this.tcForm!.patchValue({
            class_no: result.selectedValue,
          });
        }

      }
    });

  }

  previewFile() {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result;
        if (result) {
          const blob = new Blob([result], { type: this.selectedFile?.type });
          const url = URL.createObjectURL(blob);
          // Open the Blob URL in a new window or tab
          window.open(url, '_blank');
        }
      };
      reader.readAsArrayBuffer(this.selectedFile); // Use readAsArrayBuffer for binary data
    }
  }

  get isFileSelectable(): boolean {
    return !!this.tcForm!.value["un_no"]; // File can be selected if un_no is not empty
  }


  onUnNoBlur(): void {
    // if (this.tcForm!.get('un_no')?.valid && this.selectedFileChanged) 
    //   {
    //     this.QueryAllFilesInGroupAndClassNo();

    // }
  }

  onFileSelected(event: Event): void {
    if (this.tcForm!.value["guid"]) {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        this.selectedFile = input.files[0];
        const fileSizeInMB = this.selectedFile.size / (1024 * 1024); // Convert bytes to MB
        this.tcForm?.patchValue({ sds_file: this.selectedFile, file_size: fileSizeInMB });
        this.tcForm?.get("sds_file")?.updateValueAndValidity();
        if (fileSizeInMB <= this.maxFileSizeInMB) {

          this.selectedFileChanged = true;
        }

      }
    }
  }



  async downloadFiles(urls: any[]): Promise<File[]> {

    const filePromises = urls.map(async (data) => {

      let url: String = data.url;
      const response = await fetch(data.url);

      if (!response.ok) {
        throw new Error(`Failed to download file from ${url}. Status: ${response.status}`);
      }

      const blob = await response.blob();
      const fileName = url.split('/').pop() || 'downloaded-file';
      return new File([blob], fileName, { type: blob.type });
    });

    // Wait for all downloads to complete
    const files = await Promise.all(filePromises);

    return files;
  }

  async DeleteExistingSDSFiles() {



    if (this.existingSDSFilesUrls) {
      const urls: string[] = this.existingSDSFilesUrls.map(item => item.url);
      await firstValueFrom(this.fileManagerService.deleteFile(urls));
    }

  }


  async QueryClassNo() {
    let UnNumber: string = '';
    const unNoControl = this.tcForm!.get('un_no');

    if (unNoControl) {
      const value = unNoControl.value;
      UnNumber = value;
      // console.log('UN Number on blur:', value);
      // Additional logic can be added here
    }


    this.tcUNDS.SearchClassNoByUnNumber(UnNumber).subscribe(result => {
      this.newUNNo = true;
      if (result.length > 0) {
        var clsNo = this.tcForm?.get("class_no")?.value;
        this.existingClassNos = result;
        this.newUNNo = false;
        if (!clsNo || clsNo.trim() === "") clsNo = this.existingClassNos[0].class;
        this.tcForm?.patchValue({
          class_no: clsNo
        });


      }

    });


  }
  async QueryAllFilesInGroup(groupguid: string) {
    this.sdsFileLoading = true;
    this.selectedFileLoading.next(this.sdsFileLoading); // Set loading to true
    let GroupGuid: string = groupguid;
    this.selectedFileLoading.subscribe(value => {
      if (value != this.sdsFileLoading) this.selectedFileLoading.next(this.sdsFileLoading);
      console.log('Subject Value:', value); // This should not reset to false after await
    });
    // const unNoControl = this.tcForm!.get('un_no');

    //     if (unNoControl) {
    //       const value = unNoControl.value;
    //       GroupGuid=value;
    //      // console.log('UN Number on blur:', value);
    //       // Additional logic can be added here
    //     }

    this.fileManagerService.getFileUrlByGroupGuid([GroupGuid]).subscribe({
      next: async (response) => {
        console.log('Files retrieved successfully:', response);
        if (response.length > 0) {
          let files = await this.downloadFiles(response);
          if (files.length > 0) {
            this.selectedFile = files[0];
            this.existingSDSFiles = files;
            this.existingSDSFilesUrls = response;
            const fileSizeInMB = this.selectedFile.size / (1024 * 1024); // Convert bytes to MB
            this.tcForm?.patchValue({
              file_size: fileSizeInMB
            });
          }
        }
        this.sdsFileLoading = false;
        this.selectedFileLoading.next(this.sdsFileLoading); // Set loading to true

      },
      error: (error) => {
        console.error('Error retrieving files:', error);
        this.selectedFileLoading.next(false);
      },
      complete: () => {
        console.log('File retrieval process completed.');
        this.selectedFileLoading.next(false);
      }
    });


  }

  async QueryAllFilesInGroupAndClassNo() {
    //var retval:any[]=[];
    if (!this.tcForm!.value["un_no"]) return;
    //this.QueryAllFilesInGroup();
    this.QueryClassNo();
  }


  async onSubmit(groupGuid: string, tableName: string) {
    if (this.selectedFileChanged) {
      this.DeleteExistingSDSFiles();

      var fType = "pdf";
      switch (this.selectedFile!.type) {
        case "application/msword":
          fType = "doc"
          break;
      }

      const uploadMeta = {
        file: this.selectedFile!,
        metadata: {
          TableName: tableName,
          FileType: fType,
          GroupGuid: groupGuid,
          Description: "SDS file"
        }
      }

      //   var metadataJsonString =JSON.stringify(jsonObject);
      //  formData.append('files', this.selectedFile!, this.selectedFile?.name);
      //  formData.append('metadata', metadataJsonString);
      await (firstValueFrom(this.fileManagerService.uploadFiles([uploadMeta])));
      // await firstValueFrom( this.httpClient.post(uploadURL,formData));
      // this.httpClient.post(uploadURL, formData
      //  ).subscribe({
      //   next: (response) => {
      //     console.log('File successfully uploaded!', response);
      //   },
      //   error: (err) => {
      //     console.error('Upload error:', err);
      //     // Handle unknown errors more gracefully
      //     if (err.error instanceof ErrorEvent) {
      //       // Client-side error
      //       console.error('Client-side error:', err.error.message);
      //     } else {
      //       // Server-side error
      //       console.error(`Server-side error: ${err.status} - ${err.message}`);
      //     }
      //   },
      // });
    }
  }

  urlToFile(url: string, fileName: string): Promise<File> {
    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.blob();
      })
      .then(blob => {
        return new File([blob], fileName, { type: blob.type });
      })
      .catch(error => {
        console.error('Error converting URL to File:', error);
        throw error; // Re-throw the error to handle it elsewhere if needed
      });
  }

  displayClassNoFn(tr: string): string {
    return tr;
  }

  GoBackPrevious(event: Event) {
    event.stopPropagation(); // Stop the click event from propagating
    // Navigate to the route and pass the JSON object
    this.router.navigate(['/admin/tariff/tariff-cleaning'], {
      state: this.historyState

    }
    );
  }

  ShowDuplicateCargoMessage() {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(MessageDialogComponent, {
      width: '400px',
      data: {
        headerText: this.translatedLangText.WARNING,
        messageText: [this.translatedLangText.DUPLICATE_CARGO_FOUND],
        act: "warn"
      },
      direction: tempDirection
    });
    dialogRef.afterClosed().subscribe(result => {
      this.trfCleaningSubmitting = false;
      this.submitForSaving.next(this.trfCleaningSubmitting);
    });
  }
}
