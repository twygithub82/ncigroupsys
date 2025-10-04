import { environment } from "environments/environment"

export const api_endpoints = {
  staff_auth: '/api/StaffAuthentication/StaffLogin',
  staff_user_claims: '/api/StaffAuthentication/GetUserClaims',
  staff_assign_roles: '/api/StaffAuthentication/AssignStaffRolesAndTeams',
  staff_create: '/api/StaffAuthentication/CreateStaffCredential',
  staff_remove: '/api/StaffAuthentication/RemoveStaff',
  staff_query: '/api/StaffAuthentication/QueryStaff',
  staff_change_password: '/api/StaffAuthentication/ChangePassword',
  staff_refresh_token: '/api/StaffAuthentication/RefreshToken',
  user_change_password: '/api/UserAuthentication/ChangePassword',
  user_auth: '/api/UserAuthentication/UserLogin',
  user_refresh_token: '/api/UserAuthentication/RefreshToken',
  user_signup: '/api/UserAuthentication/UserSignUp',
  user_confirm_email: '/api/UserAuthentication/ConfirmEmail',
  user_forgot_password: '/api/UserAuthentication/forgot-password',
  user_post_reset_password: '/api/UserAuthentication/reset-password',
  user_get_reset_password: '/api/UserAuthentication/reset-password',
  staff_post_reset_password: '/api/StaffAuthentication/ResetStaffPassword',
  email: '/api/Emails',
}

export const uploadEndpoints = {
  uploadFiles: '/api/v2/AzureBlob/UploadFiles',
  getFileUrl: '/api/v2/AzureBlob/GetFileUrl',
  getFileUrlByGroupGuid: '/api/v2/AzureBlob/GetFileUrlByGroupGuid',
  deleteFile: '/api/v2/AzureBlob/DeleteFile'
}

export const api_full_endpoints = {
  staff_auth: `${environment.apiUrl}${api_endpoints.staff_auth}`,
  staff_assign_roles: `${environment.apiUrl}${api_endpoints.staff_assign_roles}`,
  staff_create: `${environment.apiUrl}${api_endpoints.staff_create}`,
  staff_remove: `${environment.apiUrl}${api_endpoints.staff_remove}`,
  staff_query: `${environment.apiUrl}${api_endpoints.staff_query}`,
  staff_change_password: `${environment.apiUrl}${api_endpoints.staff_change_password}`,
  staff_refresh_token: `${environment.apiUrl}${api_endpoints.staff_refresh_token}`,
  user_change_password: `${environment.apiUrl}${api_endpoints.user_change_password}`,
  user_auth: `${environment.apiUrl}${api_endpoints.user_auth}`,
  user_refresh_token: `${environment.apiUrl}${api_endpoints.user_refresh_token}`,
  user_signup: `${environment.apiUrl}${api_endpoints.user_signup}`,
  user_confirm_email: `${environment.apiUrl}${api_endpoints.user_confirm_email}`,
  user_forgot_password: `${environment.apiUrl}${api_endpoints.user_forgot_password}`,
  user_post_reset_password: `${environment.apiUrl}${api_endpoints.user_post_reset_password}`,
  user_get_reset_password: `${environment.apiUrl}${api_endpoints.user_get_reset_password}`,
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
  },
  'sid': {
    'key': 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid',
    'value': 'sid'
  }
}