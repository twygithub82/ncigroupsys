import { Route } from '@angular/router';
import { MainLayoutComponent } from './layout/app-layout/main-layout/main-layout.component';
import { AuthGuard } from '@core/guard/auth.guard';
import { AuthLayoutComponent } from './layout/app-layout/auth-layout/auth-layout.component';
import { Page404Component } from './authentication/page404/page404.component';

export const APP_ROUTE: Route[] = [
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                loadChildren: () => import('./dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTE),
            },
            {
                path: 'admin',
                loadChildren: () => import('./admin/admin.routes').then((m) => m.ADMIN_ROUTE),
            },
        ],
    },
    {
        path: 'authentication',
        component: AuthLayoutComponent,
        loadChildren: () =>
            import('./authentication/auth.routes').then((m) => m.AUTH_ROUTE),
    },
    { path: '**', component: Page404Component },
];
