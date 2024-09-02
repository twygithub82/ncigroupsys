export const environment = {
  production: true,
  apiUrl: 'https://tlx-idms-userlogin.azurewebsites.net',//'http://207.46.137.171',
  fileManagerURL: 'https://tlx-filemanagemenr-app.greenplant-68cf0a82.southeastasia.azurecontainerapps.io',
  graphQLUrl: 'http://localhost:5293',
};

export const uploadEndpoints = {
  uploadFiles: '/api/v2/AzureBlob/UploadFiles',
  getFileUrl: '/api/v2/AzureBlob/GetFileUrl',
  getFileUrlByGroupGuid: '/api/v2/AzureBlob/GetFileUrlByGroupGuid',
  deleteFiles: '/api/v2/AzureBlob/DeleteFile'
}