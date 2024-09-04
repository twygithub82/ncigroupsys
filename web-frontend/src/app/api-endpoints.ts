export const api_endpoints = {
  staff_auth: '/api/StaffAuthentication/StaffLogin',
  user_auth: '/api/UserAuthentication/UserLogin',
  file_management:'https://tlx-filemanagemenr-app.greenplant-68cf0a82.southeastasia.azurecontainerapps.io',
  graphQL_link: 'YOUR_GRAPHQL_ENDPOINT'
}

export const uploadEndpoints = {
  uploadFiles: '/api/v2/AzureBlob/UploadFiles',
  getFileUrl: '/api/v2/AzureBlob/GetFileUrl',
  getFileUrlByGroupGuid: '/api/v2/AzureBlob/GetFileUrlByGroupGuid',
  deleteFile: '/api/v2/AzureBlob/DeleteFile'
}

export const jwt_mapping = {
  'name': {
    'key': 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name',
    'value': 'name'
  },
  'email': {
    'key': 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
    'value': 'email'
  },
  'groupsid': {
    'key': 'http://schemas.microsoft.com/ws/2008/06/identity/claims/groupsid',
    'value': 'groupsid'
  },
  'role': {
    'key': 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role',
    'value': 'role'
  },
  'primarygroupsid': {
    'key': 'http://schemas.microsoft.com/ws/2008/06/identity/claims/primarygroupsid',
    'value': 'primarygroupsid'
  }
}