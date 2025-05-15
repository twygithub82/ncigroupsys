export const environment = {
  production: false,
  title: 'UAT Home',
  companyName: 'DMS GLOBAL PTE LTD',
  apiUrl: 'https://tlx-idms-userlogin-uat.azurewebsites.net',
  fileManagerURL: 'https://tlx-filemanagement-app-uat.azurewebsites.net',
  graphQLUrl: 'https://tlx-idms-gateway-uat.azurewebsites.net/graphql',
  graphqlWsUrl: 'wss://tlx-idms-global-notification-uat.azurewebsites.net/graphql',
};

export const testTypeMapping: any = {
  "5": "2.5",
  "2.5": "5"
}

export const customerInfo = {
  companyName: 'DMS GLOBAL PTE LTD',
  companyAbb: 'DMS Global',
  companyAddress: '10G Enterprise Road, Enterprise 10, Singapore 629833',
  companyPhone: '+65 6517 9848',
  companyFax: '+65 6517 9848',
  companyEmail: 'dms-global@dms.com',
  companyWebsite: 'nci.com.sg',
  companyUen: '202335130H',
  eirDisclaimerNote: 'Notwithstanding that {companyName} (UEN:{companyUen}; hereinafter known as \"{companyAbb}\") will at its best-effort basis ensure that the above tank serviced is in good condition on the service job requisite by above-named customer and accepted by {companyAbb}. {companyAbb} will not in any way, guarantee nor accept liability for damage or claim due to the condition of tank, or of any other nature whatsoever arises upon tank released. Customer is however, at all times advised to appoint a third party class surveyor to conduct a post inspection, verify and certify that the tank is in good condition prior it is released from {companyAbb}\'s Depot, at own costs and discretion.',
  eirDisclaimerVer: 'VER-2412-210206'
};

export const reportPreviewWindowDimension = {
  portrait_maxWidth: '1100px',
  portrait_width_rate: '70vw',
  landscape_maxWidth: '1400px',
  landscape_width_rate: '85vw',
  report_maxHeight: '85vh'
};

export const refreshTokenWithin: number = 1200000;

export const modulePackage: string = "starter"; // ng serve --configuration=uat, ng serve --configuration=development, ng serve --build

export const maxTankCount: number = 5;