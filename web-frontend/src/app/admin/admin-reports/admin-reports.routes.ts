import { Routes } from "@angular/router";
import { SteamMonthlyComponent } from "./steam-monthly/steam-monthly.component";
import { MainMonthlyComponent } from "./monthly-report/main-monthly.component";

export const ADMIN_REPORTS_ROUTE: Routes = [
    {
        path: "steam-monthly",
        component: SteamMonthlyComponent,
    },
    {
        path: "main-monthly",
        component: MainMonthlyComponent,
    }
];