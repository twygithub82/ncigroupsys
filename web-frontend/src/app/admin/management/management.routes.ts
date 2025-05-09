import { Routes } from "@angular/router";
import { GroupNewComponent } from "./group-new/group-new.component";
import { GroupComponent } from "./group/group.component";
import { UserNewComponent } from "./user-new/user-new.component";
import { UserComponent } from "./user/user.component";
import{MainManagementYearlyComponent} from "./reports/yearly/main-management-yearly.component";
import{MainManagementMonthlyComponent} from "./reports/monthly/main-management-monthly.component";
import{MainManagementPerformanceComponent} from "./reports/performance/main-management-performance.component";
import { MainManagementReportOrderTrackComponent } from "./reports/order_track/main-order-track.component";

export const MANAGEMENT_ROUTE: Routes = [
  {
    path: "user",
    component: UserComponent,
  },
  {
    path: "user/new/:id",
    component: UserNewComponent,
  },
  {
    path: "group",
    component: GroupComponent,
  },
  {
    path: "group/new/:id",
    component: GroupNewComponent,
  },
  {
    path: "reports/yearly",
    component: MainManagementYearlyComponent,
  },
  {
    path: "reports/monthly",
    component: MainManagementMonthlyComponent,
  },
  {
    path: "reports/performance",
    component: MainManagementPerformanceComponent,
  },
  {
    path: "reports/order-track",
    component: MainManagementReportOrderTrackComponent,
  },
];