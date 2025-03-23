import { Routes } from "@angular/router";
import { MainMonthlyComponent } from "./monthly-report/main-monthly.component";
import { MainYearlyComponent } from "./yearly-report/main-yearly.component";


export const ADMIN_REPORTS_ROUTE: Routes = [
    {
        path: "main-monthly",
        component: MainMonthlyComponent,
    },
    {
        path: "main-yearly",
        component: MainYearlyComponent,
    }
];