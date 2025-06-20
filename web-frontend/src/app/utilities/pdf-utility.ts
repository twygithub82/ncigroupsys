import { TranslateService } from "@ngx-translate/core";
import { jsPDF } from 'jspdf';
import { customerInfo } from 'environments/environment';
import { StoringOrderTankItem } from "app/data-sources/storing-order-tank";
import { Utility } from "./utility";
import html2canvas from "html2canvas";
import { CustomerCompanyItem } from "app/data-sources/customer-company";
import autoTable, { RowInput, Styles } from 'jspdf-autotable';

export class PDFUtility {
  static addText(pdf: jsPDF, content: string, topPos: number, leftPost: number, fontSize: number,
    bold :boolean=false,fontFamily: string = 'helvetica',wrap:boolean=false,maxWidth:number=0, 
    underline: boolean = false, textColor:string='#000000') {

    pdf.saveGraphicsState();
    const fontStyle = bold ? 'bold' : 'normal';
    pdf.setTextColor(textColor);
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

    if (underline) {
    const textWidth = pdf.getStringUnitWidth(content) * fontSize / pdf.internal.scaleFactor;
    const underlineY = topPos + 0.8; // Adjust as needed for spacing under text
    pdf.setLineWidth(0.1);
    pdf.line(leftPost, underlineY, leftPost + textWidth, underlineY);
   }

   
    // pdf.setFont(fontFamily, fontStyle);
    // pdf.setFontSize(fontSize); // Title font size 
    // pdf.text(content, leftPost, topPos); // Position it at the top
    pdf.restoreGraphicsState();
  }

  static addReportTitle(pdf: jsPDF, title: string, pageWidth: number, leftMargin: number, rightMargin: number, 
    topPosition: number, fontSize: number=14,underline: boolean = true,additionalBufferX: number = 0,
    textColor:string='#000000',restrictPos:boolean=true) {
    pdf.setFontSize(fontSize); // Title font size 
    pdf.setTextColor(textColor);
    const titleWidth = pdf.getStringUnitWidth(title) * pdf.getFontSize() / pdf.internal.scaleFactor;
    let titleX = (pageWidth - titleWidth) / 2; // Centering the title

    if(restrictPos)
    {
        if (topPosition <= 10) {
          topPosition = 11; // sequence page report title
        }
        else if(topPosition>=40 &&topPosition<=50)
        {
          topPosition=40;
        }
     }
  
    titleX+=additionalBufferX;
    pdf.text(title, titleX, topPosition); // Position it at the top

    // pdf.setLineDashPattern([0, 0], 0);
   
    // pdf.setLineWidth(0.1); // Set line width for underline

    if(underline){
     pdf.setLineWidth(0.1);
      // Set dashed line pattern
      pdf.setLineDashPattern([0.001, 0.001], 0);
      pdf.line(titleX, topPosition + 1, titleX + titleWidth + 1, topPosition + 1); // Draw the line under the title
    }
  }

  static AddTextAtRightCornerPage(pdf: jsPDF, text: string, pageWidth: number, leftMargin: number, rightMargin: number, topPosition: number, 
    fontSize: number,textColor:string='#000000') {
    pdf.setFontSize(fontSize); // Title font size 
    pdf.setTextColor(textColor);
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
    pdf.setLineDashPattern([0.01, 0.01], 0.1);

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
    const { dataUrl, width, height } = await this.loadPDFImage(customerInfo.companyReportLogo, 1000, undefined);

    // Add the image to the PDF
    const posX1_img = pageWidth / 1.7; //leftMargin + 5;
    const posY1_img = topMargin + 1;
    const aspectRatio= height/width;
    const w=77.5;
    const h=aspectRatio*w;
    
    pdf.addImage(dataUrl, 'JPEG', posX1_img, posY1_img, w, h); // (imageElement, format, x, y, width, height)
    // const imgHeight = heightHeader - 0;
    // const imgWidth = 80;
   // pdf.addImage(dataUrl, 'JPEG', posX1_img, posY1_img, width, height); // (imageElement, format, x, y, width, height)
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
    pdf.setLineDashPattern([0.01, 0.01], 0.1);

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
    const { dataUrl, width, height } = await this.loadPDFImage(customerInfo.companyReportLogo, 1000, undefined);

    // Add the image to the PDF
    const posX1_img = pageWidth / 1.45;
    const posY1_img = topMargin + 1;
    const aspectRatio= height/width;
    const w=77.5;
    const h=aspectRatio*w;
    
    pdf.addImage(dataUrl, 'JPEG', posX1_img, posY1_img, w, h); // (imageElement, format, x, y, width, height)
    // const imgHeight = heightHeader - 0;
    // const imgWidth = 70;
    //pdf.addImage(dataUrl, 'JPEG', posX1_img, posY1_img, width, height,'',"FAST"); // (imageElement, format, x, y, width, height)
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

  static async loadPDFImage_old(
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

 static async loadPDFImage(
  imgUrl: string,
  maxWidth?: number,
  maxHeight?: number,
  quality: number = 1 // JPEG/WEBP compression quality (0–1)
): Promise<{ dataUrl: string; width: number; height: number }> {
  const img = new Image();
  img.crossOrigin = 'Anonymous'; // Needed if image is from another origin

  return new Promise((resolve, reject) => {
    img.onload = () => {
      let { naturalWidth: width, naturalHeight: height } = img;

      const aspectRatio = width / height;

      if (maxWidth || maxHeight) {
        if (maxWidth && maxHeight) {
          if (width > maxWidth || height > maxHeight) {
            if (width / maxWidth > height / maxHeight) {
              width = maxWidth;
              height = width / aspectRatio;
            } else {
              height = maxHeight;
              width = height * aspectRatio;
            }
          }
        } else if (maxWidth && width > maxWidth) {
          width = maxWidth;
          height = width / aspectRatio;
        } else if (maxHeight && height > maxHeight) {
          height = maxHeight;
          width = height * aspectRatio;
        }
      }

      // Draw to canvas and compress
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Failed to get canvas context'));

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      const dataUrl = canvas.toDataURL('image/jpeg', quality); // or 'image/webp'

      resolve({
        dataUrl,
        width,
        height,
      });
    };

    img.onerror = () => reject(new Error(`Failed to load image from ${imgUrl}`));
    img.src = imgUrl;
  });
}


  static convertMmToPt(pdf: jsPDF): jsPDF {
  // Verify the source document is in mm
  var doc : any =pdf;

  // Conversion factor: 1mm = 2.83464567pt
  const mmToPtFactor = 2.83464567;

  // Create new document with pt units
  const newDoc = new jsPDF({
    unit: 'pt',
    compress: true,
    orientation: doc.internal.pageSize.width > doc.internal.pageSize.height ? 'landscape' : 'portrait'
  });

  // Copy document properties
  if (doc.internal.getDocumentProperties) {
    newDoc.setProperties(doc.internal.getDocumentProperties());
  }

  // Process all pages
  const totalPages = doc.getNumberOfPages();

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    doc.setPage(pageNum);
    
    // Convert page dimensions
    const mmWidth = doc.internal.pageSize.getWidth();
    const mmHeight = doc.internal.pageSize.getHeight();
    const ptWidth = mmWidth * mmToPtFactor;
    const ptHeight = mmHeight * mmToPtFactor;
    
    // Add new page if needed
    if (pageNum > 1) {
      newDoc.addPage([ptWidth, ptHeight]);
    } else {
      // Resize first page
      newDoc.internal.pageSize.width = ptWidth;
      newDoc.internal.pageSize.height = ptHeight;
    }
    
    // Copy all content (this is a simplified approach)
    // Note: In current jsPDF versions, you need to track content yourself
    // For text:
    if (doc.internal.pages[pageNum]?.texts) {
      doc.internal.pages[pageNum].texts.forEach((text: any) => {
        newDoc.text(
          text.text,
          text.x * mmToPtFactor,
          text.y * mmToPtFactor,
          {
            angle: text.angle || 0,
            align: text.align || 'left',
            baseline: text.baseline || 'top'
          }
        );
      });
    }
    
    // For lines:
    if (doc.internal.pages[pageNum]?.lines) {
      doc.internal.pages[pageNum].lines.forEach((line: any) => {
        newDoc.line(
          line.x1 * mmToPtFactor,
          line.y1 * mmToPtFactor,
          line.x2 * mmToPtFactor,
          line.y2 * mmToPtFactor,
          line.style
        );
      });
    }
  }

  return newDoc;
}

static async captureFullCardImage(card: HTMLElement): Promise<string> {
  // Clone the card into a hidden, absolutely positioned container
  const clone = card.cloneNode(true) as HTMLElement;
  clone.style.position = 'absolute';
  clone.style.top = '80px';
  clone.style.left = '300px';
  clone.style.zIndex = '-9999'; // Prevent interaction
  clone.style.visibility = 'visible';
  clone.style.opacity = '1';
  clone.style.pointerEvents = 'none';
  document.body.appendChild(clone);

  // Render the cloned element into canvas
  const canvas = await html2canvas(clone, {
    scrollY: -window.scrollY, // Prevent scroll offset distortion
    useCORS: true,
    backgroundColor: null,
    scale: 2, // Optional: improve quality
  });

  // Clean up
  document.body.removeChild(clone);

  // Convert to image
  return canvas.toDataURL('image/jpeg', 0.8);
}

 static async addHeaderWithCompanyLogo_Portriat_r1(
    pdf: jsPDF,
    pageWidth: number,
    topMargin: number,
    bottomMargin: number,
    leftMargin: number,
    rightMargin: number,
    translateService: TranslateService, // Inject TranslateService
    customerCompany:CustomerCompanyItem
  ): Promise<void> {

    const translatedLangText: any = {};
    const langText = {
      CUSTOMER: 'COMMON-FORM.CUSTOMER',
      ISSUE_DATE: 'COMMON-FORM.ISSUE-DATE',
      VALID_THROUGH: 'COMMON-FORM.VALID-THROUGH',
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

    
    const { dataUrl, width, height } = await this.loadPDFImage(customerInfo.companyReportLogo, 1000, undefined);

    const bufferX =110;
    const posX1_img = leftMargin +bufferX ;
    const posY1_img = topMargin ;
    const aspectRatio = height/width ;
    const w=80;
    const h=aspectRatio*w;
    
    pdf.addImage(dataUrl, 'JPEG', posX1_img, posY1_img, w, h); // (imageElement, format, x, y, width, height)


    pdf.setLineWidth(0.1);
    // Set dashed line pattern
    pdf.setLineDashPattern([0.01, 0.01], 0.1);

    var yPos=topMargin+27;
    // Draw top line
   pdf.line(leftMargin, yPos, (pageWidth - rightMargin), yPos);

   let posX=leftMargin;
  let posY = topMargin;

  // posY+=40;
  // pdf.setFontSize(10);
  // pdf.text(`${translatedLangText.CUSTOMER}:`, posX, posY);
  // posY+=5;
  // pdf.text(customerCompany.name||'', posX, posY);
  // posY+=5;
  // pdf.text(customerCompany.address_line1||'', posX, posY);
  // posY+=5;
  // pdf.text(customerCompany.address_line2||'', posX, posY);

  
  var buffer =40
  var textColor='#666666';
  var IssDate = `${translatedLangText.ISSUE_DATE}: ${Utility.convertDateToStr(new Date())}`;
 // this.AddTextAtRightCornerPage(pdf, IssDate, pageWidth, leftMargin, rightMargin, topMargin+buffer, 10,textColor);
 // var validDate=new Date();
  //validDate = this.addMonths(validDate, 2);
  //buffer+=5;
  //var validDateStr = `${translatedLangText.VALID_THROUGH}: ${Utility.convertDateToStr(validDate)}`;
  //this.AddTextAtRightCornerPage(pdf, validDateStr, pageWidth, leftMargin, rightMargin, topMargin+buffer, 10);
    
  }

 static addMonths(date: Date, months: number): Date {
    const result = new Date(date);
    const wholeMonths = Math.floor(months);
    const partialMonthDays = (months - wholeMonths) * 30; // Approximate a month as 30 days

    result.setMonth(result.getMonth() + wholeMonths);
    result.setDate(result.getDate() + partialMonthDays);

    return result;
  }

  static async ReportFooter_CompanyInfo_portrait_r1(pdf: jsPDF, 
    pageWidth: number, topMargin: number, 
    bottomMargin: number, leftMargin: number, 
    rightMargin: number,translateService: TranslateService) 
  {

     const translatedLangText: any = {};
    var posX=leftMargin;
    var posY = topMargin;
    var fontSz=9;
    var startY=topMargin;
    const langText = {
      GST_REG: 'COMMON-FORM.GST-REG',
      PHONE: 'COMMON-FORM.PHONE',
      
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
   var textColor='#666666';
   var companyInfo = `${customerInfo.companyName}`;
   var companyAdd = `${customerInfo.companyAddress}`
   var PhoneGST = `${translatedLangText.PHONE}: ${customerInfo.companyPhone} | ${translatedLangText.GST_REG}: ${customerInfo.companyGST}`;
   this.addText(pdf, companyInfo, posY, leftMargin, fontSz,false,'helvetica',true,55,false,textColor);
   posY+=(fontSz/2);
   this.addText(pdf, companyAdd, posY, leftMargin, fontSz,false,'helvetica',true,55,false,textColor);
  
  }

  static async ReportFooter_CompanyInfo_portrait(pdf: jsPDF, 
    pageWidth: number, topMargin: number, 
    bottomMargin: number, leftMargin: number, 
    rightMargin: number,translateService: TranslateService) 
  {

     const translatedLangText: any = {};
    var posX=leftMargin;
    var posY = topMargin;
    var fontSz=8;
    var startY=topMargin;
    const langText = {
      GST_REG: 'COMMON-FORM.GST-REG',
      PHONE: 'COMMON-FORM.PHONE',
      
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
    var minHeightHeaderCol=4;
   var data: any[][] = [
      [
        { content: `${customerInfo.companyName}`, styles: { halign: 'left', valign: 'bottom',fontStyle: 'bold',fontSize: fontSz,minHeight:minHeightHeaderCol} },
        { content: `${customerInfo.companyAddress}`, rowSpan:2 , styles:{halign:'left',valign:'top',fontSize: fontSz+1,minHeight:minHeightHeaderCol} },
        { content: `[Payment Conditions]` ,  rowSpan:3, styles: { halign: 'center', valign: 'top',fontStyle: 'bold',fontSize: fontSz,minHeight:minHeightHeaderCol} },
      ],
      [
        { content: `${translatedLangText.GST_REG}: [GST Reg No]`,styles: { halign: 'left', valign: 'bottom',fontSize: fontSz,minHeight:minHeightHeaderCol}  },
        '',
        ''
      ],
      [
        '',
        { content: `${translatedLangText.PHONE}: ${customerInfo.companyPhone}`,styles: { halign: 'left', valign: 'top',fontSize: fontSz,minHeight:minHeightHeaderCol}  },
        ''
      ],
      
    ];

            var contentWidth=pageWidth-leftMargin-rightMargin;
            
            var tblCellWidth =(pageWidth-leftMargin-rightMargin)/2;
            autoTable(pdf, {
              body: data,
              startY: startY, // Start table at the current startY value
              theme: 'grid',
              margin: { left: leftMargin },
              styles: {
                cellPadding: { left:0.5 , right: 0.5, top: 0, bottom: 0 },
                fontSize: fontSz,
                minCellHeight: minHeightHeaderCol,
                lineWidth: 0, // cell border thickness
                lineColor: [0, 0, 0], // black
                
              },
              tableWidth: contentWidth,
              columnStyles: {
                0: { cellWidth: tblCellWidth/2 },
                1: { cellWidth: tblCellWidth/2 },
                2: { cellWidth: tblCellWidth },
                
              },
              // headStyles: headStyles, // Custom header styles
              bodyStyles: {
                fillColor: [255, 255, 255],
                halign: 'left', // Left-align content for body by default
                valign: 'middle', // Vertically align content
        
              },
              pageBreak: 'avoid',
            });
  
  }
}