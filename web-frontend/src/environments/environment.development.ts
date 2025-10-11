// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  title: 'SIT IDMS',
  companyNameShort: 'NCI Global',
  companyName: 'NCI GLOBAL PTE LTD',
  apiUrl: 'https://tlx-idms-userlogin.azurewebsites.net',
  fileManagerURL: 'https://tlx-filemanagement-app-b6aga4fcfwhbggd7.southeastasia-01.azurewebsites.net',
  // graphQLUrl: 'https://tlx-idms-gateway-uat.azurewebsites.net/graphql',
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

// export const modulePackage: string = "starter";
export const modulePackage: string = "customized";
export const maxTankCount: number = 5;
export const systemCurrencyCode: string = "SGD";  