// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment1 = {
  production: true,
  title: 'IDMS',
  companyNameShort: 'NCI Global',
  companyName: 'NCI GLOBAL PTE LTD',
  apiUrl: 'https://tlx-idms-userlogin-uat.azurewebsites.net',
  fileManagerURL: 'https://tlx-filemanagement-app-uat.azurewebsites.net',
  graphQLUrl: 'https://tlx-idms-gateway-uat.azurewebsites.net/graphql',
  graphqlWsUrl: 'wss://tlx-idms-notification-uat.greenplant-68cf0a82.southeastasia.azurecontainerapps.io/graphql',
  topicSubscribe: '/idms/all/*'
};

export const environment= {
  production: false,
  title: 'SIT IDMS',
  companyNameShort: 'NCI Global',
  companyName: 'NCI GLOBAL PTE LTD',
  apiUrl: 'https://tlx-idms-userlogin.azurewebsites.net',
  fileManagerURL: 'https://tlx-filemanagement-app-b6aga4fcfwhbggd7.southeastasia-01.azurewebsites.net',
  graphQLUrl: 'https://tlx-idms-gateway.azurewebsites.net/graphql',
  graphqlWsUrl: 'wss://tlx-idms-notification.happyocean-dddaac7a.southeastasia.azurecontainerapps.io/graphql',
  topicSubscribe: '/idms/all/*'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
export const testTypeMapping: any = {
  "5": "2.5",
  "2.5": "5"
};

export const customerInfo = {
  companyName: 'NCI GLOBAL PTE LTD',
  companyAbb: 'NCI Global',
  companyAddress: '10G Enterprise Road, Enterprise 10, Singapore 629833',
  companyPhone: '+65 6517 9848',
  companyFax: '+65 6517 9848',
  companyEmail: 'enquiry@nci.com.sg',
  companyWebsite: 'nci.com.sg',
  companyUen: '202335130H',
  companyGST: '[GST Reg No]',
  eirDisclaimerNote: 'Notwithstanding that {companyName} (UEN:{companyUen}; hereinafter known as \"{companyAbb}\") will at its best-effort basis ensure that the above tank serviced is in good condition on the service job requisite by above-named customer and accepted by {companyAbb}. {companyAbb} will not in any way, guarantee nor accept liability for damage or claim due to the condition of tank, or of any other nature whatsoever arises upon tank released. Customer is however, at all times advised to appoint a third party class surveyor to conduct a post inspection, verify and certify that the tank is in good condition prior it is released from {companyAbb}\'s Depot, at own costs and discretion.',
  eirDisclaimerVer: 'VER-2412-210206',
  companyReportLogo: 'assets/images/report-logo.png'
};

export const reportPreviewWindowDimension = {
  portrait_maxWidth: '1100px',
  portrait_width_rate: '70vw',
  landscape_maxWidth: '1800px',
  landscape_width_rate: '95vw',
  report_maxHeight: '85vh'
};

export const refreshTokenWithin: number = 1200000;

//  export const modulePackage: string = "starter";
//  export const modulePackage: string = "growth";
  export const modulePackage: string = "customized";
export const maxTankCount: number = 5;
export const systemCurrencyCode: string = "SGD";
export const defaultDiscountThreshold: number = 25;


export interface cleanlinessReportTextBlock {
  text?: string | ((data: any) => string);
  type?: 'text' | 'line';   // 👈 NEW
  x?: number;
  y?: number;
  maxWidth?: number;
  inline?: boolean;
  style?: {
    font?: 'normal' | 'bold' | 'italic';
    size?: number;
    align?: 'left' | 'center' | 'right';
    lineWidth?: number;     // 👈 for horizontal line
    underline?: boolean;
  };
  marginTop?: number;
}


const fzSize = 11;
export const CLEANLINESS_COMMENT_CONFIG: cleanlinessReportTextBlock[] = [
  // {
  //   text: 'Comments',
  //   style: { font: 'bold', size: 16, align: 'left' },
  //   marginTop: 10
  // },
  {
    text: 'Summary',
    style: { size: fzSize, font: 'bold' },
    marginTop: 5
  },
  {
    text: 'This certificate confirms that the tank identified in this document has successfully completed cleaning and inspection at our depot and meets the required cleanliness standards at the time of inspection.',
    style: { size: fzSize },
    marginTop: 5
  },
  {
    type: 'line',
    marginTop: 3,
    style: {
      lineWidth: 0.3
    }
  },
  {
    text: 'Dear Sir / Madam,',
    style: { size: fzSize },
    marginTop: 8
  },
  {
    text: `We hereby certify that the above-mentioned tank has completed cleaning at our depot.`,
    style: { size: fzSize },
    marginTop: 5
  },
  {
    text: `The above-mentioned tank, including all valves, was inspected and found to be `,
    style: { size: fzSize },
    inline: true,
    marginTop: 5
  },
  {
    text: `dry, odorless, `,
    style: { font: 'bold', size: fzSize },
    inline: true
  },
  {
    text: `residue-free and visually clean`,
    style: { font: 'bold', size: fzSize },
    marginTop: 5,
    inline: true
  },
  {
    text: 'at the time of inspection.',
    style: { size: fzSize },
    inline: true
  },
  {
    text: (data) => `Seal No.: `,
    style: { font: 'bold', size: fzSize },
    inline: true,
    marginTop: 25
  },
  {
    text: (data) => `${data.sealNo || ''}`,
    style: { font: 'bold', size: fzSize, underline: true },
    inline: true

  },
  {
    text: `This report refers only to the condition of the above-mentioned tank at the time and place of inspection.`,
    style: { size: fzSize },
    marginTop: 25
  },
  {
    type: 'line',
    marginTop: 3,
    style: {
      lineWidth: 0.3
    }
  },
  {
    text: 'Remark:',
    style: { size: fzSize, font: 'bold' },
    marginTop: 5
  },
  {
    text: (data) => `${data.remark || ''}`,
    style: { size: fzSize },
    marginTop: 5
  },
  {
    type: 'line',
    marginTop: 23,
    style: {
      lineWidth: 0.3
    }
  },
  {
    text: `Generated By:`,
    style: { font: 'normal', size: fzSize - 0.5 },
    marginTop: 2,
    inline: true
  },
  {
    text: (data) => `${data.generatedBy || ''}`,
    style: { font: 'bold', size: fzSize - 0.5 },
    inline: true
  },
  {
    text: `                                                            Generated Date & Time:`,
    style: { font: 'normal', size: fzSize - 0.5 },
    inline: true
  },
  {
    text: (data) => `${data.generatedDate || ''}`,
    style: { font: 'bold', size: fzSize - 0.5 },
    inline: true
  },
  {
    text: `This is a computer generated document, no signature is required.`,
    style: { size: fzSize - 2.5, align: 'center' },
    marginTop: 15
  }
];