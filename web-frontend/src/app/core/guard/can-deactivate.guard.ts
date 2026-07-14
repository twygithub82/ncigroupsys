// can-deactivate.guard.ts
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

export interface CanComponentDeactivate {
  canDeactivate: (
    currentRoute?: ActivatedRouteSnapshot,
    currentState?: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ) => boolean | Promise<boolean>;
}

@Injectable({
  providedIn: 'root',
})
export class CanDeactivateGuard {
  canDeactivate(
    component: CanComponentDeactivate,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ): boolean | Promise<boolean> {
    return component.canDeactivate ? component.canDeactivate(currentRoute, currentState, nextState) : true;
  }
}