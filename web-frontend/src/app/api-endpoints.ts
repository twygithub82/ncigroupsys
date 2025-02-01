import { environment } from "environments/environment"

export const api_endpoints = {
  staff_auth: '/api/StaffAuthentication/StaffLogin',
  staff_refresh_token: '/api/StaffAuthentication/RefreshToken',
  user_auth: '/api/UserAuthentication/UserLogin',
  user_refresh_token: '/api/UserAuthentication/UserLogin'
}

export const uploadEndpoints = {
  uploadFiles: '/api/v2/AzureBlob/UploadFiles',
  getFileUrl: '/api/v2/AzureBlob/GetFileUrl',
  getFileUrlByGroupGuid: '/api/v2/AzureBlob/GetFileUrlByGroupGuid',
  deleteFile: '/api/v2/AzureBlob/DeleteFile'
}

export const api_full_endpoints = {
  staff_auth: `${environment.apiUrl}${api_endpoints.staff_auth}`,
  staff_refresh_token: `${environment.apiUrl}${api_endpoints.staff_refresh_token}`,
  user_auth: `${environment.apiUrl}${api_endpoints.user_auth}`,
  user_refresh_token: `${environment.apiUrl}${api_endpoints.user_refresh_token}`,
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