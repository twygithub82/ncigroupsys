import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, ElementRef, Inject, OnInit,QueryList,ViewChild, ViewChildren } from '@angular/core';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { StoringOrderTankDS, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TranslateModule,TranslateService } from '@ngx-translate/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Utility } from 'app/utilities/utility';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DatePipe } from '@angular/common';
import { TariffCleaningDS, TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { Apollo } from 'apollo-angular';
import { CommonModule } from '@angular/common';
import { startWith, debounceTime, tap } from 'rxjs';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { MatTabBody, MatTabGroup, MatTabHeader, MatTabsModule } from '@angular/material/tabs';

export interface DialogData {
  action?: string;
  selectedValue?:string;
  // item: StoringOrderTankItem;
   langText?: any;
  // populateData?: any;
  // index: number;
  // sotExistedList?: StoringOrderTankItem[]
}

export interface TabData {
  label: string;
  images: {
    src: string;
    alt: string;
    classNo: string;
    isSelected: boolean;
  }[];
}


@Component({
  selector: 'app-tariff-cleaning-new-form-dialog',
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
    MatDialogClose,
    DatePipe,
    MatNativeDateModule,
    TranslateModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    CommonModule,
    NgxMaskDirective,
    MatTabsModule,
    MatTabGroup,
    MatTabHeader,
    MatTabBody,
  ],
})
export class FormDialogComponent {
  action: string;
  index?: number;
  dialogTitle?: string;
  storingOrderTankForm?: UntypedFormGroup;
  storingOrderTank?: StoringOrderTankItem;
  sotExistedList?: StoringOrderTankItem[];
  last_cargoList?: TariffCleaningItem[];
  startDate = new Date();
  tabsData: TabData[]=[];
  translatedLangText: any = {};
  langText = {
    CARGO_CLASS_1 :"COMMON-FORM.CARGO-CLASS-1",
    CARGO_CLASS_1_4 :"COMMON-FORM.CARGO-CLASS-1-4",
    CARGO_CLASS_1_5 :"COMMON-FORM.CARGO-CLASS-1-5",
    CARGO_CLASS_1_6 :"COMMON-FORM.CARGO-CLASS-1-6",
    CARGO_CLASS_2_1 :"COMMON-FORM.CARGO-CLASS-2-1",
    CARGO_CLASS_2_2 :"COMMON-FORM.CARGO-CLASS-2-2",
    CARGO_CLASS_2_3 :"COMMON-FORM.CARGO-CLASS-2-3",
    CARGO_CLASS_3: "COMMON-FORM.CARGO-CLASS-3",
    CARGO_CLASS_4_1: "COMMON-FORM.CARGO-CLASS-4-1",
    CARGO_CLASS_4_2:"COMMON-FORM.CARGO-CLASS-4-2",
    CARGO_CLASS_4_3:"COMMON-FORM.CARGO-CLASS-4-3",
    CARGO_CLASS_5_1:"COMMON-FORM.CARGO-CLASS-5-1",
    CARGO_CLASS_5_2:"COMMON-FORM.CARGO-CLASS-5-2",
    CARGO_CLASS_6_1:"COMMON-FORM.CARGO-CLASS-6-1",
    CARGO_CLASS_6_2:"COMMON-FORM.CARGO-CLASS-6-2",
    CARGO_CLASS_7_1:"COMMON-FORM.CARGO-CLASS-7-1",
    CARGO_CLASS_7_2:"COMMON-FORM.CARGO-CLASS-7-2",
    CARGO_CLASS_7_3:"COMMON-FORM.CARGO-CLASS-7-3",
    CARGO_CLASS_8:"COMMON-FORM.CARGO-CLASS-8",
    CARGO_CLASS_9_1:"COMMON-FORM.CARGO-CLASS-9-1",
    CARGO_CLASS_9_2:"COMMON-FORM.CARGO-CLASS-9-2"
  };

  selectedTabIndex = 0; // Active tab index
  selectedClassNo: string | null = null; // Holds the selected class number
  tcDS: TariffCleaningDS;
  sotDS: StoringOrderTankDS;
  lastCargoControl = new UntypedFormControl('', [Validators.required, AutocompleteSelectionValidator(this.last_cargoList)]);

   // Reference to all tab headers
   @ViewChildren('tabHeader') tabHeaders!: QueryList<ElementRef>;
   
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private translate: TranslateService
  ) {
    // Set the defaults

    this.tcDS = new TariffCleaningDS(this.apollo);
    this.sotDS = new StoringOrderTankDS(this.apollo);
    this.action = data.action!;
    this.selectedClassNo=data.selectedValue!;
    this.translateLangText();
    this.SetTabContent();
    // Deselect the currently selected image
    this.clearPreviousSelection();
    this.selectedTabIndex=this.findTabIndexByClassNo(this.selectedClassNo!);
    if(this.selectedTabIndex!==-1)
    {
        // Mark the selected image as 'isSelected'
        const tab = this.tabsData[this.selectedTabIndex];
        const selectedImage = tab.images.find(image => image.classNo === this.selectedClassNo);
        if (selectedImage) {
          selectedImage.isSelected = true; // Mark the selected image
        }
  
     // this.scrollToTabHeader(this.selectedTabIndex);
    }
  }

  SetTabContent(){

    this.tabsData = [
      {
        label: "1.x",
        images: [
          { src: "assets/images/idms/tariff/1.jpg", alt: this.translatedLangText.CARGO_CLASS_1, classNo: "Explosive" , isSelected: false  },
          { src: "assets/images/idms/tariff/1_4.jpg", alt: this.translatedLangText.CARGO_CLASS_1_4, classNo: this.translatedLangText.CARGO_CLASS_1_4, isSelected: false },
          { src: "assets/images/idms/tariff/1_5.jpg", alt: this.translatedLangText.CARGO_CLASS_1_5, classNo: this.translatedLangText.CARGO_CLASS_1_5, isSelected: false  },
          { src: "assets/images/idms/tariff/1_6.jpg", alt: this.translatedLangText.CARGO_CLASS_1_6, classNo: this.translatedLangText.CARGO_CLASS_1_6, isSelected: false  }
        ]
      },
      {
        label: "2.x",
        images: [
          { src: "assets/images/idms/tariff/2_1.jpg", alt: this.translatedLangText.CARGO_CLASS_2_1, classNo: this.translatedLangText.CARGO_CLASS_2_1, isSelected: false  },
          { src: "assets/images/idms/tariff/2_2.jpg", alt: this.translatedLangText.CARGO_CLASS_2_2, classNo: this.translatedLangText.CARGO_CLASS_2_2, isSelected: false  },
          { src: "assets/images/idms/tariff/2_3.jpg", alt: this.translatedLangText.CARGO_CLASS_2_3, classNo: this.translatedLangText.CARGO_CLASS_2_3, isSelected: false  }
        ]
      },
      {
        label: "3.x",
        images: [
          { src: "assets/images/idms/tariff/3.jpg", alt: this.translatedLangText.CARGO_CLASS_3, classNo: this.translatedLangText.CARGO_CLASS_3, isSelected: false  }
        ]
      },
      {
        label: "4.x",
        images: [
          { src: "assets/images/idms/tariff/4_1.jpg", alt: this.translatedLangText.CARGO_CLASS_4_1, classNo: this.translatedLangText.CARGO_CLASS_4_1, isSelected: false  },
          { src: "assets/images/idms/tariff/4_2.jpg", alt: this.translatedLangText.CARGO_CLASS_4_2, classNo: this.translatedLangText.CARGO_CLASS_4_2, isSelected: false  },
          { src: "assets/images/idms/tariff/4_3.jpg", alt: this.translatedLangText.CARGO_CLASS_4_3, classNo: this.translatedLangText.CARGO_CLASS_4_3, isSelected: false  }
        ]
      },
      {
        label: "5.x",
        images: [
          { src: "assets/images/idms/tariff/5_1.jpg", alt: this.translatedLangText.CARGO_CLASS_5_1, classNo: this.translatedLangText.CARGO_CLASS_5_1, isSelected: false  },
          { src: "assets/images/idms/tariff/5_2.jpg", alt: this.translatedLangText.CARGO_CLASS_5_2, classNo: this.translatedLangText.CARGO_CLASS_5_2, isSelected: false  }
        ]
      },
      {
        label: "6.x",
        images: [
          { src: "assets/images/idms/tariff/6_1.jpg", alt: this.translatedLangText.CARGO_CLASS_6_1, classNo: this.translatedLangText.CARGO_CLASS_6_1, isSelected: false  },
          { src: "assets/images/idms/tariff/6_2.jpg", alt: this.translatedLangText.CARGO_CLASS_6_2, classNo: this.translatedLangText.CARGO_CLASS_6_2, isSelected: false  }
        ]
      },
      {
        label: "7.x",
        images: [
          { src: "assets/images/idms/tariff/7_1.jpg", alt: this.translatedLangText.CARGO_CLASS_7_1, classNo: this.translatedLangText.CARGO_CLASS_7_1, isSelected: false  },
          { src: "assets/images/idms/tariff/7_2.jpg", alt: this.translatedLangText.CARGO_CLASS_7_2, classNo: this.translatedLangText.CARGO_CLASS_7_2, isSelected: false  },
          { src: "assets/images/idms/tariff/7_3.jpg", alt: this.translatedLangText.CARGO_CLASS_7_3, classNo: this.translatedLangText.CARGO_CLASS_7_3, isSelected: false  }
        ]
      },
      {
        label: "8.x",
        images: [
          { src: "assets/images/idms/tariff/8.jpg", alt: this.translatedLangText.CARGO_CLASS_8, classNo: this.translatedLangText.CARGO_CLASS_8, isSelected: false  }
        ]
      },
      {
        label: "9.x",
        images: [
          { src: "assets/images/idms/tariff/9_1.jpg", alt: this.translatedLangText.CARGO_CLASS_9_1, classNo: this.translatedLangText.CARGO_CLASS_9_1, isSelected: false  },
          { src: "assets/images/idms/tariff/9_2.jpg", alt: this.translatedLangText.CARGO_CLASS_9_2, classNo: this.translatedLangText.CARGO_CLASS_9_2, isSelected: false  }
        ]
      }
    ];
  }

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }
  

  
  selectClassNo(value:string, tabIndex:number):void{
    const returnDialog: DialogData = {
      selectedValue:value
    }
    this.selectedTabIndex=tabIndex;
    console.log('valid');
    this.dialogRef.close(returnDialog);
  }

  SelectNA(value:string)
  {
    const returnDialog: DialogData = {
      selectedValue:value
    }
   
    console.log('valid');
    this.dialogRef.close(returnDialog);
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
  
  isSelected(classNo: string): boolean {
    

    return this.selectedClassNo === classNo;
  }

  findTabIndexByClassNo(classNo: string): number {
    return this.tabsData.findIndex(tab => 
      tab.images.some(image => image.classNo === classNo)
    );
  }

  // scrollToTabHeader(index: number): void {
  //   setTimeout(() => {
  //     const tabHeaderArray = this.tabHeaders.toArray();
  //     const selectedTabHeader = tabHeaderArray[index].nativeElement;
  //     selectedTabHeader.scrollIntoView({ behavior: 'smooth', block: 'center' });
  //   }, 0);
  // }

  clearPreviousSelection(): void {
    // Deselect the previously selected image
    this.tabsData.forEach(tab => {
      tab.images.forEach(image => {
        image.isSelected = false;
      });
    });
  }
}
