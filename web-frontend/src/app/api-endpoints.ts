export const api_endpoints = {
  staff_auth: '/api/StaffAuthentication/StaffLogin',
  user_auth: '/api/UserAuthentication/UserLogin',
  graphQL_link: 'YOUR_GRAPHQL_ENDPOINT'
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