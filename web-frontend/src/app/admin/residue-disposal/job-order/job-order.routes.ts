import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guard/auth.guard";

import { JobOrderResidueDisposalComponent } from "./job-order.component";
import { JobOrderAllocationResidueDisposalComponent } from "../job-order-allocation/job-order-allocation.component";
import { ResidueJobOrderTaskDetailsComponent } from "../job-order-task-details/job-order-task-details.component";

export const JOB_ORDER_ROUTES: Routes = [
  {
    path: "",
    component: JobOrderResidueDisposalComponent,
    canActivate: [AuthGuard],
    data: {
      expectedFunctions: [
        'RESIDUE_DISPOSAL_JOB_ALLOCATION_EDIT',
        'RESIDUE_DISPOSAL_JOB_ALLOCATION_DELETE',
        'RESIDUE_DISPOSAL_JOB_ALLOCATION_VIEW',
        'RESIDUE_DISPOSAL_JOBS_VIEW',
        'RESIDUE_DISPOSAL_JOBS_DELETE',
        'RESIDUE_DISPOSAL_JOBS_EDIT'
      ]
    }
  },
  {
    path: "allocation/:id",
    component: JobOrderAllocationResidueDisposalComponent,
    canActivate: [AuthGuard],
    data: {
      expectedFunctions: [
        'RESIDUE_DISPOSAL_JOB_ALLOCATION_EDIT',
        'RESIDUE_DISPOSAL_JOB_ALLOCATION_DELETE',
        'RESIDUE_DISPOSAL_JOB_ALLOCATION_VIEW'
      ]
    }
  },
  {
    path: "task/:id/:residue_id",
    component: ResidueJobOrderTaskDetailsComponent,
    canActivate: [AuthGuard],
    data: {
      expectedFunctions: [
        'RESIDUE_DISPOSAL_JOBS_VIEW',
        'RESIDUE_DISPOSAL_JOBS_DELETE',
        'RESIDUE_DISPOSAL_JOBS_EDIT'
      ]
    }
  }
];