import { Injectable } from '@angular/core';
import { AuthService } from '@core/service/auth.service';
import { modulePackage } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})

export class ModulePackageService {
  modulePackage = modulePackage;
  constructor(private authService: AuthService) { }

  isStarterPackage() {
    return modulePackage === "starter"
  }

  isGrowthPackage() {
    return modulePackage === "growth"
  }

  isCustomizedPackage() {
    return modulePackage === "customized"
  }

 

  AllowExcelReport()
  {
    return  this.isCustomizedPackage();
  }

  AllowPdfReport()
{
  return  this.isCustomizedPackage()|| this.isGrowthPackage();
}

  getModulePackage() {
    return modulePackage;
  }

  // Delegates to AuthService
  hasFunctions(expectedFunctions: string[] | undefined): boolean {
    return this.authService.hasFunctions(expectedFunctions);
  }
}