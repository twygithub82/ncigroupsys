import { Routes } from '@angular/router';

export const ADMIN_ROUTE: Routes = [
  {
    path: 'inventory',
    loadChildren: () => import('./inventory/inventory.routes').then(m => m.INVENTORY_ROUTE)
  },
  {
    path: 'parameter',
    loadChildren: () => import('./parameter/parameter.routes').then(m => m.PARAMETER_ROUTE)
  },
  {
    path: 'tariff',
    loadChildren: () => import('./tariff/tariff.routes').then(m => m.TARIFF_ROUTE)
  },
  {
    path: 'package',
    loadChildren: () => import('./package/package.routes').then(m => m.PACKAGE_ROUTE)
  },
  {
    path: 'repair',
    loadChildren: () => import('./repair/repair.routes').then(m => m.REPAIR_ROUTE)
  },
  {
    path: 'master',
    loadChildren: () => import('./master/master.routes').then(m => m.MASTER_ROUTE)
  },
  {
    path: 'management',
    loadChildren: () => import('./management/management.routes').then(m => m.MANAGEMENT_ROUTE)
  },
  {
    path: 'user-management',
    loadChildren: () => import('./user-management/user-management.routes').then(m => m.USER_MANAGEMENT_ROUTE)
  },
  {
    path: 'residue-disposal',
    loadChildren: () => import('./residue-disposal/residue-disposal.routes').then(m => m.RESIDUE_DISPOSAL_ROUTE)
  },
  {
    path: 'cleaning',
    loadChildren: () => import('./cleaning/cleaning.routes').then(m => m.CLEANING_ROUTE)
  },
  {
    path: 'steam',
    loadChildren: () => import('./steam/steam.routes').then(m => m.STEAM_ROUTE)
  },
  {
    path: 'survey',
    loadChildren: () => import('./survey/survey.routes').then(m => m.SURVEY_ROUTE)
  },
  {
    path: 'billing',
    loadChildren: () => import('./billing/billing.routes').then(m => m.BILLING_ROUTE)
  },
  {
    path: 'reports',
    loadChildren: () => import('./reports/reports.routes').then(m => m.REPORTS_ROUTE)
  },
  {
    path: 'admin-reports',
    loadChildren: () => import('./admin-reports/admin-reports.routes').then(m => m.ADMIN_REPORTS_ROUTE)
  },
];

// @NgModule({
//   imports: [RouterModule.forChild(ADMIN_ROUTE)],
//   exports: [RouterModule]
// })
// export class AdminRoutingModule { }
