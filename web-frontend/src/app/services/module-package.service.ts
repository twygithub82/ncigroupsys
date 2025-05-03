import { Injectable } from '@angular/core';
import { modulePackage } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})

export class ModulePackageService {
  modulePackage = modulePackage;
  constructor() { }

  isStarterPackage() {
    return modulePackage === "starter"
  }

  isGrowthPackage() {
    return modulePackage === "growth"
  }

  isCustomizedPackage() {
    return modulePackage === "customized"
  }

  getModulePackage() {
    return modulePackage;
  }
}