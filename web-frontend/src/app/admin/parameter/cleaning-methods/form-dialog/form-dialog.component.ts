import { CdkDrag, CdkDragDrop, CdkDragPlaceholder, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { CleaningFormulaDS, CleaningFormulaItem } from 'app/data-sources/cleaning-formulas';
import { CleaningMethodDS,CleaningMethodItem } from 'app/data-sources/cleaning-method';
import { CleaningStepItem } from 'app/data-sources/cleaning-steps';
import { StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { Utility } from 'app/utilities/utility';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { provideNgxMask } from 'ngx-mask';
import { debounceTime, startWith, tap } from 'rxjs/operators';

export interface DialogData {
  action?: string;
  selectedValue?: number;
  // item: StoringOrderTankItem;
  langText?: any;
  selectedItem: CleaningMethodItem;
  // populateData?: any;
  // index: number;
  // sotExistedList?: StoringOrderTankItem[]
}

@Component({
  selector: 'app-cleaning-methods-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss'],
  providers: [provideNgxMask()],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogContent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatDatepickerModule,
    MatSelectModule,
    MatOptionModule,
    MatNativeDateModule,
    TranslateModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    CommonModule,
    MatTabsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatTooltipModule,
    CdkDrag,
    //CdkDropListGroup,
    CdkDropList,
    CdkDragPlaceholder,
   // CdkDragHandle,

  ],
})
export class FormDialogComponent {
  displayedColumns = [
   //  'select',
    // 'img',
    'customer_code',
     'actions',
    // 'profile_name',
    // 'storage_cost',
  ];

  action: string;
  index?: number;
  dialogTitle?: string;


  storingOrderTank?: StoringOrderTankItem;
  sotExistedList?: StoringOrderTankItem[];
  last_cargoList?: TariffCleaningItem[];
  startDate = new Date();
  pcForm: UntypedFormGroup;
  lastCargoControl = new UntypedFormControl();
  cleanFormulaControl=new UntypedFormControl();
  //custCompClnCatDS :CustomerCompanyCleaningCategoryDS;
  //  catDS :CleaningCategoryDS;
  mthDS: CleaningMethodDS;
  fmlDS:CleaningFormulaDS;
  cleanFormulaList:CleaningFormulaItem[]=[];
  updatedMethodFormulaLinkList:CleaningStepItem[]=[];
  existingMethodFormulaLinkList:CleaningStepItem[]=[];

  translatedLangText: any = {};
  langText = {
    NEW: 'COMMON-FORM.NEW',
    ADD: 'COMMON-FORM.ADD',
    EDIT: 'COMMON-FORM.EDIT',
    HEADER: 'COMMON-FORM.CARGO-DETAILS',
    HEADER_OTHER: 'COMMON-FORM.CARGO-OTHER-DETAILS',
    CUSTOMER_CODE: 'COMMON-FORM.CUSTOMER-CODE',
    CUSTOMER_COMPANY_NAME: 'COMMON-FORM.COMPANY-NAME',
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
    CARGO_NOTE: 'COMMON-FORM.CARGO-NOTE',
    CARGO_CLASS_1: "COMMON-FORM.CARGO-CALSS-1",
    CARGO_CLASS_1_4: "COMMON-FORM.CARGO-CALSS-1-4",
    CARGO_CLASS_1_5: "COMMON-FORM.CARGO-CALSS-1-5",
    CARGO_CLASS_1_6: "COMMON-FORM.CARGO-CALSS-1-6",
    CARGO_CLASS_2_1: "COMMON-FORM.CARGO-CALSS-2-1",
    CARGO_CLASS_2_2: "COMMON-FORM.CARGO-CALSS-2-2",
    CARGO_CLASS_2_3: "COMMON-FORM.CARGO-CALSS-2-3",
    PACKAGE_MIN_COST: 'COMMON-FORM.PACKAGE-MIN-COST',
    PACKAGE_MAX_COST: 'COMMON-FORM.PACKAGE-MAX-COST',
    PACKAGE_DETAIL: 'COMMON-FORM.PACKAGE-DETAIL',
    PACKAGE_CLEANING_ADJUSTED_COST: "COMMON-FORM.PACKAGE-CLEANING-ADJUST-COST",
    CATEGORY_NAME: "COMMON-FORM.CATEGORY-NAME",
    CATEGORY_DESCRIPTION: "COMMON-FORM.CATEGORY-DESCRIPTION",
    CATEGORY_COST: "COMMON-FORM.CARGO-COST",
    CLEANING_CATEGORY: "COMMON-FORM.CLEANING-CATEGORY",
    CLEANING_METHOD: 'COMMON-FORM.CLEANING-PROCESS',
    DESCRIPTION: 'COMMON-FORM.DESCRIPTION',
    METHOD_NAME: "COMMON-FORM.METHOD-NAME",
    CLEANING_FORMULA:"MENUITEMS.CLEANING-MANAGEMENT.LIST.CLEAN-FORMULA",
    CLEANING_STEPS:"COMMON-FORM.CLEANING-STEPS",
    NO_CLEANING_STEPS:"COMMON-FORM.NO-CLEANING-STEPS",
    
  };


  selectedItem: CleaningMethodItem;
  //tcDS: TariffCleaningDS;
  //sotDS: StoringOrderTankDS;

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private translate: TranslateService,
    private snackBar: MatSnackBar,
  ) {
    // Set the defaults

    this.selectedItem = data.selectedItem;
    this.updatedMethodFormulaLinkList = JSON.parse(JSON.stringify(this.selectedItem.cleaning_method_formula || []));
    this.pcForm = this.createCleaningCategory();
    this.mthDS = new CleaningMethodDS(this.apollo);
    this.fmlDS= new CleaningFormulaDS(this.apollo);
    this.action = data.action!;
    this.translateLangText();
    this.initializeValueChanges();
   
  }

  initializeValueChanges() {
      this.pcForm!.get('formula')!.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        tap(value => {
          var searchCriteria = '';
          if (typeof value === 'string') {
            searchCriteria = value;
          } else {
            searchCriteria = value.description;
          }
           this.fmlDS.search({ or: [{ description: { contains: searchCriteria } }] }, { description: 'ASC' }).subscribe(data => {
            this.cleanFormulaList = data
            this.updateValidators(this.cleanFormulaControl, this.cleanFormulaList);
          });
        })
      ).subscribe();
     
    }

     updateValidators(untypedFormControl: UntypedFormControl, validOptions: any[]) {
        untypedFormControl.setValidators([
          AutocompleteSelectionValidator(validOptions)
        ]);
      }
  createCleaningCategory(): UntypedFormGroup {
    return this.fb.group({
      selectedItem: this.selectedItem,
      name: this.selectedItem.name,
      description: this.selectedItem.description,
      selected_formulas:this.selectedItem,
      formula:this.cleanFormulaControl,
      remarks: ['']
    });
  }

  GetButtonCaption() {
    if (this.selectedItem.name !== undefined) {
      return this.translatedLangText.UPDATE;
    }
    else {
      return this.translatedLangText.ADD;
    }
  }
  GetTitle() {
    if (this.selectedItem.name !== undefined) {
      return this.translatedLangText.UPDATE + " " + this.translatedLangText.CLEANING_METHOD;
    }
    else {
      return this.translatedLangText.NEW + " " + this.translatedLangText.CLEANING_METHOD;
    }
  }

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }


  canEdit() {
    return true;
  }

  handleSaveSuccess(count: any) {
    if ((count ?? 0) > 0) {

      console.log('valid');
      this.dialogRef.close(count);
    }
  }



  save() {

    if (!this.pcForm?.valid) return;

    let cc: CleaningMethodItem = new CleaningMethodItem(this.selectedItem);
    // tc.guid='';
    cc.name = this.pcForm.value['name'];
    cc.description = this.pcForm.value['description'];


    const where: any = {};
    if (this.pcForm!.value['name']) {
      where.name = { eq: this.pcForm!.value['name'] };
    }

    this.mthDS.search(where).subscribe(p => {
      if (p.length == 0) {
        if (this.selectedItem.guid) {
          cc.cleaning_method_formula=this.processCleaningStepListForUpdating();
          this.mthDS.updateCleaningMethod(cc).subscribe(result => {
            console.log(result)
            this.handleSaveSuccess(result?.data?.updateCleaningMethod);
          });

        }
        else {
        
          cc.cleaning_method_formula=this.removeCleaningFormulaFromUpdatedMethodFormulaLinkList();
          this.mthDS.addCleaningMethod(cc).subscribe(result => {
            console.log(result)
            this.handleSaveSuccess(result?.data?.addCleaningMethod);
          });
        }

      }
      else {
        var allowUpdate = true;
        for (let i = 0; i < p.length; i++) {
          if (p[i].guid != this.selectedItem.guid) {
            allowUpdate = false;
            break;  // Exit the loop
          }
        }
        if (allowUpdate) {

          if (this.selectedItem.guid) {
            cc.cleaning_method_formula=this.processCleaningStepListForUpdating();
            this.mthDS.updateCleaningMethod(cc).subscribe(result => {
              console.log(result)
              this.handleSaveSuccess(result?.data?.updateCleaningMethod);

            });

          }
        }
        else {
          this.pcForm?.get('name')?.setErrors({ existed: true });
        }
      }
    });

  }

  markFormGroupTouched(formGroup: UntypedFormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      if (control instanceof UntypedFormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control!.markAsTouched();
      }
    });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  displayCleaningFormulaFn(item:CleaningFormulaItem):string
  {
    return item?.description||'';
  }
  canAddFormula():boolean
  {
     var canAddfml:boolean=false;
   // var cleanFormula:CleaningFormulaItem=this.pcForm!.get('formula')!.value;
     if(this.pcForm!.get('formula')!.value?.description)
        canAddfml=true;

     return (canAddfml);
  }

  AddCleaningStep()
  {
     var item : CleaningFormulaItem = this.pcForm!.get('formula')!.value;
     var cleanMthFml:any = new CleaningStepItem();
     if(this.selectedItem)
     {
       cleanMthFml.method_guid=this.selectedItem.guid;
     }
     cleanMthFml.sequence= this.updatedMethodFormulaLinkList.length||0;
     cleanMthFml.formula_guid=item.guid;
     cleanMthFml.cleaning_formula=new CleaningFormulaItem(item);
      this.updatedMethodFormulaLinkList = [...this.updatedMethodFormulaLinkList, cleanMthFml];
     this.cleanFormulaControl.reset('');
  }

  cancelItem(row:CleaningStepItem)
  {

    // Example: Removing an item
      this.updatedMethodFormulaLinkList = this.updatedMethodFormulaLinkList.filter(item => item.cleaning_formula?.description !== row.cleaning_formula?.description);

  }
 

  drop2(event: CdkDragDrop<CleaningStepItem[]>) {
    moveItemInArray(this.updatedMethodFormulaLinkList, event.previousIndex, event.currentIndex);
    this.updatedMethodFormulaLinkList.forEach((item, index) => {
      item.sequence = index + 1; // Assign sequence starting from 1
    });
  }
 
  removeCleaningFormulaFromUpdatedMethodFormulaLinkList():CleaningStepItem[]
  { 
    var clonedList : any[] =JSON.parse(JSON.stringify(this.updatedMethodFormulaLinkList || []));
    clonedList= clonedList.map(item=>{
      delete item.cleaning_formula;
      return new CleaningStepItem(item);
    });
    // this.updatedMethodFormulaLinkList.forEach(i=>{
    //   delete i.cleaning_formula;
    // });
    return clonedList;
  }

  processCleaningStepListForUpdating():any
  {
     //var retval:any;
    // var clonedExistingStep = JSON.parse(JSON.stringify(this.selectedItem.cleaning_method_formula || []));
     var clonedUpdRemovedFormula= this.removeCleaningFormulaFromUpdatedMethodFormulaLinkList();
     var clonedUpdatedStep = clonedUpdRemovedFormula.map(item => {
      var itm: any = { ...item, action: 'NEW' }; // Create a new object with the `action` property
      return itm;
    });

    clonedUpdatedStep.forEach(i=>{
      var step=this.selectedItem.cleaning_method_formula?.find(e=>e.guid==i.guid);

      if(step)
      {
        var itm :any = i;
        itm.action="EDIT";
      }
    });
    
    this.selectedItem.cleaning_method_formula?.forEach(i=>{
      var step=clonedUpdatedStep.find(e=>e.guid==i.guid);

      if(!step)
      {
        var delStep : any = new CleaningStepItem(i);
        delStep.action="CANCEL";
        delete delStep.cleaning_formula;
        clonedUpdatedStep.push(delStep)
      }

    });

    return clonedUpdatedStep;
  }
}
