/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router, NavigationEnd, RouterLink, RouterLinkActive } from '@angular/router';
import { DOCUMENT, NgStyle, NgClass } from '@angular/common';
import {
  Component,
  Inject,
  ElementRef,
  OnInit,
  Renderer2,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { ROUTES } from './sidebar-items';
import { AuthService } from '@core';
import { RouteInfo } from './sidebar.metadata';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FeatherModule } from 'angular-feather';
import { NgScrollbar } from 'ngx-scrollbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Utility } from 'app/utilities/utility';
import { environment, modulePackage } from 'environments/environment';
import { MatTooltip } from '@angular/material/tooltip';
import { Direction } from '@angular/cdk/bidi';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule,
    NgStyle,
    NgScrollbar,
    RouterLinkActive,
    NgClass,
    TranslateModule,
    FeatherModule,
    MatTooltip,
    MatDividerModule,
  ],
})
export class SidebarComponent extends UnsubscribeOnDestroyAdapter implements OnInit, OnDestroy {
  public sidebarItems!: RouteInfo[];
  public innerHeight?: number;
  public bodyTag!: HTMLElement;

  translatedLangText: any = {};
  langText = {
    SOFTWARE_NAME: 'SOFTWARE-NAME.TEXT',
    ACCOUNT: 'COMMON-FORM.ACCOUNT',
    LOGOUT: 'COMMON-FORM.LOGOUT',
    CONFIRM_LOGOUT: 'COMMON-FORM.CONFIRM-LOGOUT',
  }

  listMaxHeight?: string;
  listMaxWidth?: string;
  userFullName?: string;
  userImg?: string;
  userType?: string;
  headerHeight = 60;
  currentRoute?: string;
  routerObj;
  menuIcon = 'chevron_left';
  isHovered = false;

  envTest = environment.title;

  name?: string;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    public elementRef: ElementRef,
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog,
    private translate: TranslateService
  ) {
    super();
    this.elementRef.nativeElement.closest('body');
    this.routerObj = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        // close sidebar on mobile screen after menu select
        this.renderer.removeClass(this.document.body, 'overlay-open');
      }
    });
    this.name = this.authService.currentUserName;
    this.translateLangText();
  }
  @HostListener('window:resize', ['$event'])
  windowResizecall() {
    this.setMenuHeight();
    this.checkStatuForResize(false);
  }
  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.renderer.removeClass(this.document.body, 'overlay-open');
    }
  }
  callToggleMenu(event: Event, length: number) {
    if (length > 0) {
      const parentElement = (event.target as HTMLInputElement).closest('li');
      const activeClass = parentElement?.classList.contains('active');

      if (activeClass) {
        this.renderer.removeClass(parentElement, 'active');
      } else {
        this.renderer.addClass(parentElement, 'active');
      }
    }
  }
  ngOnInit() {
    if (this.authService.currentUserValue) {
      this.userFullName = this.authService.currentUserValue.name;
      this.userImg = this.authService.currentUserValue.img;
      this.userType = 'Admin';
      this.sidebarItems = this.filterMenuByPackage(ROUTES, modulePackage);
    }

    // this.sidebarItems = ROUTES.filter((sidebarItem) => sidebarItem);
    // this.checkScreenSizeAndCollapse();
    this.initLeftSidebar();
    this.bodyTag = this.document.body;
  }
  override ngOnDestroy() {
    super.ngOnDestroy();
    this.routerObj.unsubscribe();
  }
  initLeftSidebar() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this;
    // Set menu height
    _this.setMenuHeight();
    _this.checkStatuForResize(true);
  }
  setMenuHeight() {
    this.innerHeight = window.innerHeight;
    const height = this.innerHeight - this.headerHeight;
    this.listMaxHeight = height + '';
    this.listMaxWidth = '500px';
  }
  isOpen() {
    return this.bodyTag.classList.contains('overlay-open');
  }
  checkStatuForResize(firstTime: boolean) {
    if (window.innerWidth < 1025) {
      this.renderer.addClass(this.document.body, 'ls-closed');
    } else {
      this.renderer.removeClass(this.document.body, 'ls-closed');
    }
  }
  mouseHover() {
    this.isHovered = true;
    const body = this.elementRef.nativeElement.closest('body');
    if (body.classList.contains('submenu-closed')) {
      this.renderer.addClass(this.document.body, 'side-closed-hover');
      this.renderer.removeClass(this.document.body, 'submenu-closed');
    }
  }
  mouseOut() {
    this.isHovered = false;
    const body = this.elementRef.nativeElement.closest('body');
    if (body.classList.contains('side-closed-hover')) {
      this.renderer.removeClass(this.document.body, 'side-closed-hover');
      this.renderer.addClass(this.document.body, 'submenu-closed');
    }
  }
  mobileMenuSidebarOpen(event: Event, className: string) {
    const hasClass = (event.target as HTMLInputElement).classList.contains(
      className
    );
    if (hasClass) {
      this.renderer.removeClass(this.document.body, className);
    } else {
      this.renderer.addClass(this.document.body, className);
    }
  }
  callSidemenuCollapse() {
    const hasClass = this.document.body.classList.contains('side-closed');
    if (hasClass) {
      this.renderer.removeClass(this.document.body, 'side-closed');
      this.renderer.removeClass(this.document.body, 'submenu-closed');
      this.menuIcon = 'chevron_left';
    } else {
      this.renderer.addClass(this.document.body, 'side-closed');
      this.renderer.addClass(this.document.body, 'submenu-closed');
      this.menuIcon = 'chevron_right';
    }

    const sideClosedExists = this.document.body.classList.contains('side-closed');
    if (sideClosedExists) {
      this.renderer.removeClass(this.document.body, 'side-closed-hover');
    }
  }

  logout() {
    this.authService.logout();
  }

  logoutDialog(event: Event) {
    event.preventDefault(); // Prevents the form submission

    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        headerText: this.translatedLangText.CONFIRM_LOGOUT,
        action: 'new',
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result.action === 'confirmed') {
        this.authService.logout();
      }
    });
  }

  checkScreenSizeAndCollapse() {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 1366) { // Tablet width or smaller
      this.callSidemenuCollapse();
    }
  }

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }

  // filterMenuByPackage(menu: RouteInfo[], modulePackage: string): RouteInfo[] {
  //   return menu
  //     .map(item => {
  //       const filteredSubmenu = item.submenu
  //         ? this.filterMenuByPackage(item.submenu, modulePackage)
  //         : [];

  //       const isVisible =
  //         (!item.modulePackage || item.modulePackage.length === 0 || item.modulePackage.includes(modulePackage)) ||
  //         filteredSubmenu.length > 0;

  //       if (!isVisible) return null;

  //       return {
  //         ...item,
  //         submenu: filteredSubmenu
  //       };
  //     })
  //     .filter((item): item is RouteInfo => item !== null);
  // }

  filterMenuByPackage(menu: RouteInfo[], modulePackage: string): RouteInfo[] {
    return menu
      .map(item => {
        const filteredSubmenu = item.submenu
          ? this.filterMenuByPackage(item.submenu, modulePackage)
          : [];

        // First: check function access
        const hasFunctionAccess =
          !item.expectedFunctions ||
          item.expectedFunctions.length === 0 ||
          this.authService.hasFunctions(item.expectedFunctions);

        if (!hasFunctionAccess) return null;

        // Then: check module access
        const hasModuleAccess =
          !item.modulePackage ||
          item.modulePackage.length === 0 ||
          item.modulePackage.includes(modulePackage);

        const isVisible = hasModuleAccess || filteredSubmenu.length > 0;

        if (!isVisible) return null;

        return {
          ...item,
          submenu: filteredSubmenu
        };
      })
      .filter((item): item is RouteInfo => item !== null);
  }
}
