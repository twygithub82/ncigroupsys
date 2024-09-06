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
    FeatherModule
  ],
})
export class SidebarComponent implements OnInit, OnDestroy {
  public sidebarItems!: RouteInfo[];
  public innerHeight?: number;
  public bodyTag!: HTMLElement;

  translatedLangText: any = {};
  langText = {
    SOFTWARE_NAME: 'SOFTWARE-NAME.TEXT'
  }

  listMaxHeight?: string;
  listMaxWidth?: string;
  userFullName?: string;
  userImg?: string;
  userType?: string;
  headerHeight = 60;
  currentRoute?: string;
  routerObj;
  menuIcon = 'radio_button_checked';
  isHovered = false;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    public elementRef: ElementRef,
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.elementRef.nativeElement.closest('body');
    this.routerObj = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        // close sidebar on mobile screen after menu select
        this.renderer.removeClass(this.document.body, 'overlay-open');
      }
    });
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
      this.sidebarItems = ROUTES.filter((sidebarItem) => sidebarItem);
    }

    // this.sidebarItems = ROUTES.filter((sidebarItem) => sidebarItem);
    this.checkScreenSizeAndCollapse();
    this.initLeftSidebar();
    this.bodyTag = this.document.body;
  }
  ngOnDestroy() {
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
      this.menuIcon = 'radio_button_checked';
    } else {
      this.renderer.addClass(this.document.body, 'side-closed');
      this.renderer.addClass(this.document.body, 'submenu-closed');
      this.menuIcon = 'radio_button_unchecked';
    }

    const sideClosedHover =
      this.document.body.classList.contains('side-closed');
    if (sideClosedHover) {
      this.renderer.removeClass(this.document.body, 'side-closed-hover');
    }
  }
  logout() {
    this.authService.logout().subscribe((res: { success: any; }) => {
      if (!res.success) {
        this.router.navigate(['/authentication/signin']);
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
}
