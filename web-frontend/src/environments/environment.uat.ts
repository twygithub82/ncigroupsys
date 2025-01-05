// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  title: 'UAT Home',
  apiUrl: 'https://tlx-idms-userlogin-uat.azurewebsites.net',
  fileManagerURL: 'https://tlx-filemanagemenr-app.greenplant-68cf0a82.southeastasia.azurecontainerapps.io',
  graphQLUrl: 'https://tlx-idms-gateway-uat.azurewebsites.net/graphql',
  graphqlWsUrl: 'wss://tlx-idms-global-notification-uat.azurewebsites.net/graphql',
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
}