import { Routes } from "@angular/router";
import { SteamMonthlyComponent } from "./steam-monthly/steam-monthly.component";

export const ADMIN_REPORTS_ROUTE: Routes = [
    {
        path: "admin-reports/steam-monthly",
        component: SteamMonthlyComponent,
    },
];