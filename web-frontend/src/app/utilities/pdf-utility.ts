import { TranslateService } from "@ngx-translate/core";
import { jsPDF } from 'jspdf';
import { customerInfo } from 'environments/environment';
import { StoringOrderTankItem } from "app/data-sources/storing-order-tank";
import { Utility } from "./utility";

export class PDFUtility {
  static addText(pdf: jsPDF, content: string, topPos: number, leftPost: number, fontSize: number,
    bold :boolean=false,fontFamily: string = 'helvetica',wrap:boolean=false,maxWidth:number=0) {

    pdf.saveGraphicsState();
    const fontStyle = bold ? 'bold' : 'normal';
    if(wrap){
      pdf.setFont(fontFamily, fontStyle);
      pdf.setFontSize(fontSize); // Title font size 
      pdf.text(content, leftPost, topPos, {maxWidth:maxWidth});
    }
    else{
      pdf.setFont(fontFamily, fontStyle);
      pdf.setFontSize(fontSize); // Title font size 
      pdf.text(content, leftPost, topPos);
    }
    // pdf.setFont(fontFamily, fontStyle);
    // pdf.setFontSize(fontSize); // Title font size 
    // pdf.text(content, leftPost, topPos); // Position it at the top
    pdf.restoreGraphicsState();
  }

  static addReportTitle(pdf: jsPDF, title: string, pageWidth: number, leftMargin: number, rightMargin: number, topPosition: number) {
    pdf.setFontSize(14); // Title font size 
    const titleWidth = pdf.getStringUnitWidth(title) * pdf.getFontSize() / pdf.internal.scaleFactor;
    const titleX = (pageWidth - titleWidth) / 2; // Centering the title

    pdf.text(title, titleX, topPosition); // Position it at the top

    pdf.setLineDashPattern([0, 0], 0);
    // Draw underline for the title
    pdf.setLineWidth(0.1); // Set line width for underline
    pdf.line(titleX, topPosition + 2, titleX + titleWidth + 1, topPosition + 2); // Draw the line under the title
  }

  static AddTextAtRightCornerPage(pdf: jsPDF, text: string, pageWidth: number, leftMargin: number, rightMargin: number, topPosition: number, fontSize: number) {
    pdf.setFontSize(fontSize); // Title font size 
    const titleWidth = pdf.getStringUnitWidth(text) * pdf.getFontSize() / pdf.internal.scaleFactor;
    const titleX = (pageWidth - titleWidth) - rightMargin; // Centering the title

    pdf.text(text, titleX, topPosition); // Position it at the top

    // pdf.setLineDashPattern([0, 0], 0);
    // Draw underline for the title
    // pdf.setLineWidth(0.1); // Set line width for underline
    // pdf.line(titleX, topPosition+2, titleX + titleWidth, topPosition+2); // Draw the line under the title
  }

  static AddTextAtCenterPage(pdf: jsPDF, text: string, pageWidth: number, leftMargin: number, rightMargin: number, topPosition: number, fontSize: number) {
    pdf.setFontSize(fontSize); // Title font size 
    const titleWidth = pdf.getStringUnitWidth(text) * pdf.getFontSize() / pdf.internal.scaleFactor;
    const titleX = (pageWidth - titleWidth) / 2; // Centering the title

    pdf.text(text, titleX, topPosition); // Position it at the top

    // pdf.setLineDashPattern([0, 0], 0);
    // Draw underline for the title
    // pdf.setLineWidth(0.1); // Set line width for underline
    // pdf.line(titleX, topPosition+2, titleX + titleWidth, topPosition+2); // Draw the line under the title
  }

  static previewPDF_window(pdf: jsPDF, win: Window) {
    const pdfBlob = pdf.output('blob');
    const blobUrl = URL.createObjectURL(pdfBlob);

    // Try opening in a new window
    //const newWindow = window.open(blobUrl, '_blank','noopener,noreferrer');

    if (win) {
      win.location.href = blobUrl;
    }
  }

  static previewPDF(pdf: jsPDF, fileName: string = 'document.pdf') {
    const pdfBlob = pdf.output('blob');

    const blobUrl = URL.createObjectURL(pdfBlob);
    // Try opening in a new window
    const newWindow = window.open(blobUrl, '_blank');
    //const newWindow = window.open(blobUrl, fileName);

    if (!newWindow) {
      pdf.save(fileName);
    } else {
      // Cleanup the URL after some time
      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
      }, 10000); // Increased delay to ensure the PDF loads
    }
  }


    static previewPDF_new(pdf: jsPDF, fileName: string = 'document.pdf') {
    // 🧾 Set metadata
      pdf.setProperties({
        title: 'My Custom PDF',
        subject: 'Demo of jsPDF metadata',
        author: 'Your Name or Company',
        keywords: 'jsPDF, Angular, demo',
        creator: 'Angular App'
      });

    const pdfBlob = pdf.output('blob');
    const blobUrl = URL.createObjectURL(pdfBlob);
    // Try opening in a new window
    //const newWindow = window.open(blobUrl, '_blank');
    const newWindow = window.open(blobUrl);
    // Optionally download
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'my-file.pdf'; // Set the desired filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 1000); // Delay to avoid immediate doubl

    // if (!newWindow) {
    //   pdf.save(fileName);
    // } else {
    //   // Cleanup the URL after some time
    //   setTimeout(() => {
    //     URL.revokeObjectURL(blobUrl);
    //   }, 10000); // Increased delay to ensure the PDF loads
    // }
  }

 static async addHeaderWithCompanyLogo_Portriat(
    pdf: jsPDF,
    pageWidth: number,
    topMargin: number,
    bottomMargin: number,
    leftMargin: number,
    rightMargin: number,
    translateService: TranslateService // Inject TranslateService
  ): Promise<void> {

    const translatedLangText: any = {};
    const langText = {
      PHONE: 'COMMON-FORM.PHONE',
      FAX: 'COMMON-FORM.FAX',
      WEB: 'COMMON-FORM.WEB',
      CRN: 'COMMON-FORM.CRN',
    };

    // Translate each key in langText
    for (const key of Object.keys(langText) as (keyof typeof langText)[]) {
      try {
        translatedLangText[key] = await translateService.get(langText[key]).toPromise();
      } catch (error) {
        console.error(`Error translating key "${key}":`, error);
        translatedLangText[key] = langText[key]; // Fallback to the original key
      }
    }

    pdf.setLineWidth(0.1);
    // Set dashed line pattern
    pdf.setLineDashPattern([1, 1], 0.5);

    // Draw top line
    pdf.line(leftMargin, topMargin, (pageWidth - rightMargin), topMargin);

    // Define header height
    const heightHeader: number = 28;

    // Draw bottom line
    pdf.line(leftMargin, topMargin + heightHeader, (pageWidth - rightMargin), topMargin + heightHeader);

    // Add company name
    pdf.setFontSize(12);
    const companyNameWidth = pdf.getStringUnitWidth(customerInfo.companyName) * pdf.getFontSize();
    let posX = leftMargin + 36.5; //pageWidth / 1.75;
    let posY = topMargin + 8;
    pdf.text(customerInfo.companyName, posX, posY);

    // Add company address
    pdf.setFontSize(10);
    posX -= 20.5;
    posY += 5;
    pdf.text(customerInfo.companyAddress, posX, posY);

    // Add phone, fax
    let nextLine = `${translatedLangText.PHONE}: ${customerInfo.companyPhone}`;
    posX += 8.5;
    posY += 5;
    pdf.text(nextLine, posX, posY);
    nextLine = `${translatedLangText.FAX}: ${customerInfo.companyFax}`;
    pdf.text(nextLine, posX + 39, posY);

    // Add website, company UEN
    nextLine = `${translatedLangText.WEB}: ${customerInfo.companyWebsite}`;
    posX += 0;
    posY += 5;
    pdf.text(nextLine, posX, posY);
    nextLine = `${translatedLangText.CRN}: ${customerInfo.companyUen}`;
    pdf.text(nextLine, posX + 39, posY);

    // // Load and add company logo
    // const imgUrl = customerInfo.companyReportLogo;
    // const img = new Image();

    // // Wait for the image to load
    // await new Promise<void>((resolve, reject) => {
    //   img.onload = () => resolve();
    //   img.onerror = () => reject(new Error('Failed to load image'));
    //   img.src = imgUrl;
    // });
    const { img, width, height } = await this.loadPDFImage(customerInfo.companyReportLogo, 80, undefined);

    // Add the image to the PDF
    const posX1_img = pageWidth / 1.7; //leftMargin + 5;
    const posY1_img = topMargin + 0;
    // const imgHeight = heightHeader - 0;
    // const imgWidth = 80;
    pdf.addImage(img, 'JPEG', posX1_img, posY1_img, width, height); // (imageElement, format, x, y, width, height)
  }

 static async addHeaderWithCompanyLogo_Landscape(
    pdf: jsPDF,
    pageWidth: number,
    topMargin: number,
    bottomMargin: number,
    leftMargin: number,
    rightMargin: number,
    translateService: TranslateService // Inject TranslateService
  ): Promise<void> {

    const translatedLangText: any = {};
    const langText = {
      PHONE: 'COMMON-FORM.PHONE',
      FAX: 'COMMON-FORM.FAX',
      WEB: 'COMMON-FORM.WEB',
      CRN: 'COMMON-FORM.CRN',
    };

    // Translate each key in langText
    for (const key of Object.keys(langText) as (keyof typeof langText)[]) {
      try {
        translatedLangText[key] = await translateService.get(langText[key]).toPromise();
      } catch (error) {
        console.error(`Error translating key "${key}":`, error);
        translatedLangText[key] = langText[key]; // Fallback to the original key
      }
    }
    pdf.setLineWidth(0.1);
    // Set dashed line pattern
    pdf.setLineDashPattern([1, 1], 0.5);

    // Draw top line
    pdf.line(leftMargin, topMargin, (pageWidth - rightMargin), topMargin);

    // Define header height
    const heightHeader: number = 28;

    // Draw bottom line
    pdf.line(leftMargin, topMargin + heightHeader, (pageWidth - rightMargin), topMargin + heightHeader);

    // Add company name
    pdf.setFontSize(12);
    const companyNameWidth = pdf.getStringUnitWidth(customerInfo.companyName) * pdf.getFontSize();
    let posX = pageWidth / 3.5;
    let posY = topMargin + 8;
    pdf.text(customerInfo.companyName, posX, posY);

    // Add company address
    pdf.setFontSize(10);
    posX -= 20.5;
    posY += 5;
    pdf.text(customerInfo.companyAddress, posX, posY);

    // Add phone, fax
    let nextLine = `${translatedLangText.PHONE}: ${customerInfo.companyPhone}`;
    posX += 8.5;
    posY += 5;
    pdf.text(nextLine, posX, posY);
    nextLine = `${translatedLangText.FAX}: ${customerInfo.companyFax}`;
    pdf.text(nextLine, posX + 39, posY);

    // Add website, company UEN
    nextLine = `${translatedLangText.WEB}: ${customerInfo.companyWebsite}`;
    posX += 0;
    posY += 5;
    pdf.text(nextLine, posX, posY);
    nextLine = `${translatedLangText.CRN}: ${customerInfo.companyUen}`;
    pdf.text(nextLine, posX + 39, posY);

    // // Load and add company logo
    // const imgUrl = customerInfo.companyReportLogo;
    // const img = new Image();

    // // Wait for the image to load
    // await new Promise<void>((resolve, reject) => {
    //   img.onload = () => resolve();
    //   img.onerror = () => reject(new Error('Failed to load image'));
    //   img.src = imgUrl;
    // });
    const { img, width, height } = await this.loadPDFImage(customerInfo.companyReportLogo, 80, undefined);

    // Add the image to the PDF
    const posX1_img = pageWidth - (width + leftMargin);
    const posY1_img = topMargin + 0;
    // const imgHeight = heightHeader - 0;
    // const imgWidth = 70;
    pdf.addImage(img, 'JPEG', posX1_img, posY1_img, width, height); // (imageElement, format, x, y, width, height)
  }


  static async drawRectangleBox(
    doc: jsPDF,
    x: number,
    y: number,
    width: number,
    height: number,
    options?: {
      lineWidth?: number;
      lineColor?: string;
      fillColor?: string;
      borderRadius?: number;
      dashed?: boolean;
      dashPattern?: number[];
    }
  ){
    // Save the current graphics state
    doc.saveGraphicsState();
  
    // Set default options
    const {
      lineWidth = 0.3,
      lineColor = '#000000',
      fillColor = undefined,
      borderRadius = 0,
      dashed = false,
      dashPattern = [3, 2],
    } = options || {};
  
    // Set line properties
    doc.setLineWidth(lineWidth);
    doc.setDrawColor(lineColor);
  
    // Set fill if provided
    if (fillColor) {
      doc.setFillColor(fillColor);
    }
  
    // Set dashed line if requested
    if (dashed) {
      doc.setLineDashPattern(dashPattern, 0);
    }
  
    // Draw the rectangle
    if (borderRadius > 0) {
      // Draw a rounded rectangle
      doc.roundedRect(x, y, width, height, borderRadius, borderRadius, fillColor ? 'FD' : 'D');
    } else {
      // Draw a regular rectangle
      doc.rect(x, y, width, height, fillColor ? 'FD' : 'D');
    }
  
    // Restore the graphics state
    doc.restoreGraphicsState();
  }

  static removeDeletedInGateAndOutGate(sot: StoringOrderTankItem) {
    sot.in_gate = sot?.in_gate?.filter(i => i.delete_dt == null || i.delete_dt == 0) || [];
    sot.out_gate = sot?.out_gate?.filter(i => i.delete_dt == null || i.delete_dt == 0) || [];
    sot.cleaning = sot?.cleaning?.filter(i => i.delete_dt == null || i.delete_dt == 0) || [];
    sot.repair = sot?.repair?.filter(i => i.delete_dt == null || i.delete_dt == 0) || [];
  }

  static DisplayLastTest(sot: StoringOrderTankItem): string {
    var lastTest: string = '';
    this.removeDeletedInGateAndOutGate(sot);

    if (sot.in_gate?.[0]?.in_gate_survey) {
      var last_test_dt: Date = new Date();
      if (sot.in_gate?.[0]?.in_gate_survey?.test_dt) {
        last_test_dt = Utility.convertDate(sot.in_gate?.[0]?.in_gate_survey?.test_dt) as Date || new Date();
      }

      lastTest = sot.in_gate?.[0]?.in_gate_survey?.test_class_cv || "";
      lastTest += ` ${Utility.convertDateToStr_MonthYear(last_test_dt)}`;//` ${Utility.convertDateToStr(last_test_dt)}`;
      if (sot.in_gate?.[0]?.in_gate_survey?.last_test_cv) {
        lastTest += ` ${(sot.in_gate?.[0]?.in_gate_survey?.last_test_cv == "2.5" ? "(A)" : "(H)")}`;
      }
      //nextTest = this.cvDS.getCodeDescription(sot.in_gate?.[0]?.in_gate_survey?.next_test_cv, this.testTypeCvList) || '';
    }

    if (sot.out_gate?.[0]?.out_gate_survey) {
      var last_test_dt: Date = new Date();
      if (sot.out_gate?.[0]?.out_gate_survey?.test_dt) {
        last_test_dt = Utility.convertDate(sot.out_gate?.[0]?.out_gate_survey?.test_dt) as Date || new Date();
      }

      lastTest = sot.out_gate?.[0]?.out_gate_survey?.test_class_cv || "";
      lastTest += ` ${Utility.convertDateToStr_MonthYear(last_test_dt)}`; //` ${Utility.convertDateToStr(last_test_dt)}`;
      if (sot.out_gate?.[0]?.out_gate_survey?.last_test_cv) {
        lastTest += ` ${(sot.out_gate?.[0]?.out_gate_survey?.last_test_cv == "2.5" ? "(A)" : "(H)")}`;
      }
    }
    // if (this.queryType == 1) {
    //   //lastTest = this.cvDS.getCodeDescription(sot.in_gate?.[0]?.in_gate_survey?.last_test_cv, this.testTypeCvList) || '';
    // }
    // else {
    //   lastTest = this.cvDS.getCodeDescription(sot.out_gate?.[0]?.out_gate_survey?.last_test_cv, this.testTypeCvList) || '';
    // }
    return lastTest;
  }

  static DisplayNextTest(sot: StoringOrderTankItem): string {
    var nextTest: string = '';
    var yearsToAdd = 2.5;
    var next_test_dt: Date = new Date();
    this.removeDeletedInGateAndOutGate(sot);
    if (sot.in_gate?.[0]?.in_gate_survey) {
      if (sot.in_gate?.[0]?.in_gate_survey?.test_dt) {
        next_test_dt = Utility.convertDate(sot.in_gate?.[0]?.in_gate_survey?.test_dt) as Date || new Date();
      }

      next_test_dt.setMonth(next_test_dt.getMonth() + (yearsToAdd * 12));
      // nextTest = sot.in_gate?.[0]?.in_gate_survey?.test_class_cv||"";
      nextTest += ` ${Utility.convertDateToStr_MonthYear(next_test_dt)}`;//` ${Utility.convertDateToStr(next_test_dt)}`;
      if (sot.in_gate?.[0]?.in_gate_survey?.last_test_cv) {
        nextTest += ` ${(sot.in_gate?.[0]?.in_gate_survey?.next_test_cv == "2.5" ? "(A)" : "(H)")}`;
      }
      //nextTest = this.cvDS.getCodeDescription(sot.in_gate?.[0]?.in_gate_survey?.next_test_cv, this.testTypeCvList) || '';
    }

    if (sot.out_gate?.[0]?.out_gate_survey) {
      nextTest = "";
      if (sot.out_gate?.[0]?.out_gate_survey?.test_dt) {
        next_test_dt = Utility.convertDate(sot.out_gate?.[0]?.out_gate_survey?.test_dt) as Date || new Date();
      }
      next_test_dt.setMonth(next_test_dt.getMonth() + (yearsToAdd * 12));
      //nextTest = sot.in_gate?.[0]?.in_gate_survey?.test_class_cv||"";
      nextTest += ` ${Utility.convertDateToStr_MonthYear(next_test_dt)}`;
      if (sot.out_gate?.[0]?.out_gate_survey?.last_test_cv) {
        nextTest += ` ${(sot.in_gate?.[0]?.in_gate_survey?.next_test_cv == "2.5" ? "(A)" : "(H)")}`;
      }
    }
    return nextTest;
  }

  static isSelectedDateGreaterThanToday(selectedMonth: number, selectedYear: number): boolean {
    // Get today's date
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // getMonth() returns 0-11, so add 1
    const currentYear = today.getFullYear();

    // Compare the selected year and month with today's year and month
    if (selectedYear > currentYear) {
      return true; // Selected year is greater
    } else if (selectedYear === currentYear && selectedMonth > currentMonth) {
      return true; // Selected year is the same, but month is greater
    }

    return false; // Selected date is not greater than today
  }

  static async loadPDFImage(
    imgUrl: string,
    maxWidth?: number,
    maxHeight?: number
  ): Promise<{ img: HTMLImageElement; width: number; height: number }> {
    const img = new Image();

    return new Promise((resolve, reject) => {
      img.onload = () => {
        let { naturalWidth: width, naturalHeight: height } = img;

        if (maxWidth || maxHeight) {
          const aspectRatio = width / height;

          if (maxWidth && maxHeight) {
            // Fit within both bounds
            if (width > maxWidth || height > maxHeight) {
              if (width / maxWidth > height / maxHeight) {
                width = maxWidth;
                height = width / aspectRatio;
              } else {
                height = maxHeight;
                width = height * aspectRatio;
              }
            }
          } else if (maxWidth) {
            if (width > maxWidth) {
              width = maxWidth;
              height = width / aspectRatio;
            }
          } else if (maxHeight) {
            if (height > maxHeight) {
              height = maxHeight;
              width = height * aspectRatio;
            }
          }
        }

        resolve({
          img,
          width,
          height,
        });
      };

      img.onerror = () => reject(new Error(`Failed to load image from ${imgUrl}`));
      img.src = imgUrl;
    });
  }
}