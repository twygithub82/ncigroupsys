import { DOCUMENT, NgClass } from '@angular/common';
import {
  Component,
  Inject,
  ElementRef,
  OnInit,
  Renderer2,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ConfigService } from '@config';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { InConfiguration, AuthService, LanguageService } from '@core';
import { NgScrollbar } from 'ngx-scrollbar';
import { MatMenuModule } from '@angular/material/menu';
import { FeatherIconsComponent } from '../../shared/components/feather-icons/feather-icons.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import {GraphqlNotificationService} from '../../services/global-notification.service'
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { ComponentUtil } from 'app/utilities/component-util';
import { MatSnackBar, MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition } from '@angular/material/snack-bar';

interface Notifications {
  message: string;
  time: string;
  icon: string;
  color: string;
  status: string;
  module:string;
  id:number;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    FeatherIconsComponent,
    MatMenuModule,
    RouterLink,
    NgClass,
    NgScrollbar,
    MatIconModule,
    CommonModule
  ],
  providers: [LanguageService],
})
export class HeaderComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  public config!: InConfiguration;
  userImg?: string;
  homePage?: string;
  isNavbarCollapsed = true;
  flagvalue: string | string[] | undefined;
  countryName: string | string[] = [];
  langStoreValue?: string;
  defaultFlag?: string;
  isOpenSidebar?: boolean;
  docElement?: HTMLElement;
  isFullScreen = false;
  graphqlNotificationService?: GraphqlNotificationService
  name = '';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    public elementRef: ElementRef,
    private configService: ConfigService,
    private authService: AuthService,
    private router: Router,
    private apollo: Apollo,
    private snackBar: MatSnackBar,
   // private graphqlNotificationService: GraphqlNotificationService,
    public languageService: LanguageService
  ) {
    super();
    this.graphqlNotificationService = new GraphqlNotificationService(this.apollo);
  }
  listLang = [
    { text: 'English', flag: 'assets/images/flags/us.jpg', lang: 'en' },
    { text: 'Spanish', flag: 'assets/images/flags/spain.jpg', lang: 'es' },
    { text: 'German', flag: 'assets/images/flags/germany.jpg', lang: 'de' },
  ];

  notificationSubscription?: Subscription;
  notificationCount: number = 0; // Example count
  notifications: Notifications[] = [
    // {
    //   message: 'Please check your mail',
    //   time: '14 mins ago',
    //   icon: 'mail',
    //   color: 'nfc-green',
    //   status: 'msg-unread',
    // },
    // {
    //   message: 'New Employee Added..',
    //   time: '22 mins ago',
    //   icon: 'person_add',
    //   color: 'nfc-blue',
    //   status: 'msg-read',
    // },
    // {
    //   message: 'Your leave is approved!! ',
    //   time: '3 hours ago',
    //   icon: 'event_available',
    //   color: 'nfc-orange',
    //   status: 'msg-read',
    // },
    // {
    //   message: 'Lets break for lunch...',
    //   time: '5 hours ago',
    //   icon: 'lunch_dining',
    //   color: 'nfc-blue',
    //   status: 'msg-read',
    // },
    // {
    //   message: 'Employee report generated',
    //   time: '14 mins ago',
    //   icon: 'description',
    //   color: 'nfc-green',
    //   status: 'msg-read',
    // },
    // {
    //   message: 'Please check your mail',
    //   time: '22 mins ago',
    //   icon: 'mail',
    //   color: 'nfc-red',
    //   status: 'msg-read',
    // },
    // {
    //   message: 'Salary credited...',
    //   time: '3 hours ago',
    //   icon: 'paid',
    //   color: 'nfc-purple',
    //   status: 'msg-read',
    // },
  ];
  ngOnInit() {
    this.config = this.configService.configData;
    this.userImg = 'assets/images/user/' + this.authService.currentUserValue.img;
    this.docElement = document.documentElement;

    this.homePage = 'dashboard/dashboard1';

    this.langStoreValue = localStorage.getItem('lang') as string;
    const val = this.listLang.filter((x) => x.lang === this.langStoreValue);
    this.countryName = val.map((element) => element.text);

    this.name = this.authService.currentUserValue.name;
    this.NotificationSubscribe();
    this.searchNotificationRecords();
    if (val.length === 0) {
      if (this.flagvalue === undefined) {
        this.defaultFlag = 'assets/images/flags/us.jpg';
      }
    } else {
      this.flagvalue = val.map((element) => element.flag);
    }
  }

  callFullscreen() {
    if (!this.isFullScreen) {
      if (this.docElement?.requestFullscreen != null) {
        this.docElement?.requestFullscreen();
      }
    } else {
      document.exitFullscreen();
    }
    this.isFullScreen = !this.isFullScreen;
  }
  setLanguage(text: string, lang: string, flag: string) {
    this.countryName = text;
    this.flagvalue = flag;
    this.langStoreValue = lang;
    this.languageService.setLanguage(lang);
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

    const hasClass2 = this.document.body.classList.contains('side-closed');
    if (hasClass2) {
      // this.renderer.removeClass(this.document.body, "side-closed");
      this.renderer.removeClass(this.document.body, 'submenu-closed');
    } else {
      // this.renderer.addClass(this.document.body, "side-closed");
      this.renderer.addClass(this.document.body, 'submenu-closed');
    }
  }
  callSidemenuCollapse() {
    const hasClass = this.document.body.classList.contains('side-closed');
    if (hasClass) {
      this.renderer.removeClass(this.document.body, 'side-closed');
      this.renderer.removeClass(this.document.body, 'submenu-closed');
      localStorage.setItem('collapsed_menu', 'false');
    } else {
      this.renderer.addClass(this.document.body, 'side-closed');
      this.renderer.addClass(this.document.body, 'submenu-closed');
      localStorage.setItem('collapsed_menu', 'true');
    }
  }
  logout() {
    this.subs.sink = this.authService.logout().subscribe((res: { success: any; }) => {
      if (!res.success) {
        this.router.navigate(['/authentication/signin']);
      }
    });
  }

  private searchNotificationRecords()
  {
    this.subs.sink =this.graphqlNotificationService!.SearchNotificationData({},{ date: 'DESC' }).subscribe(data=>{

       let rec= data;
       rec.forEach(item=>{
        let notifyCls :Notifications={
          message:item.message!,
          color : this.getNotificationColor(item.id!),
          //color: 'nfc-orange',
          icon : this.getNotificationIcon(item.id!),
          // icon :"mail",
          status: 'msg-read',
          time: '',
          module:item.module_cv!,
          id:item.id!,
        }
        this.notifications.push(notifyCls);
       });
    });

   
  }

  private NotificationSubscribe(){

    this.notificationSubscription = this.graphqlNotificationService!.notificationTriggered.subscribe(
      (notification) => {
        //alert(message.messageReceived.event_id + " " + message.messageReceived.event_name);
        if(notification.notificationTriggered.id>0)
        {
          const notify : any = notification.notificationTriggered;
          const notifyCls :Notifications={
            message:notify.message,
            color : this.getNotificationColor(notify.id),
            //color: 'nfc-orange',
            icon : this.getNotificationIcon(notify.id),
            // icon :"mail",
            status: 'msg-read',
            time: '',
            module:notify.module_cv,
            id:notify.id,
          }
          this.notifications.unshift(notifyCls);
          this.notificationCount += 1;
          const successMsg:string ="New Notification Added";
          ComponentUtil.showNotification('snackbar-info', successMsg, 'top', 'right', this.snackBar);
        }
        
      },
      (error) => console.error(error),
    );
  }

   resetCounter()
  {
     this.notificationCount=0;
  }

  clickNotificationItem(notification:Notifications)
  {
    let defaultLink:string="";
    switch(notification.module)
    {
      case "tariff-cleaning":
        defaultLink="admin/tariff/tariff-cleaning";
        break;
      case "package-cleaning":
        defaultLink="admin/package/package-cleaning";
        break;
      case "storing-order":
        defaultLink="admin/inventory/storing-order";
          break;
      case "in-gate":
        defaultLink="admin/inventory/in-gate";
        break;
      case "in-gate-survey":
        defaultLink="admin/inventory/in-gate-survey";
        break;
    }
    if(defaultLink!="") 
      this.router.navigate([defaultLink]);
  }

  getNotificationIcon(module_id:number):string
  {
    let defaultIcon:string="email";
    switch(module_id)
    {
      case 1:
        defaultIcon="store";
        break;
      case 2:
        defaultIcon="toll";
        break;
      case 3:
          defaultIcon="watch_later";
          break;
      case 4:
        defaultIcon="warning";
        break;
      case 5:
        defaultIcon="error_outline";
        break;
    }
    return defaultIcon;
  }

  getNotificationColor(module_id:number):string
  {
    let defaultColor:string="nfc-green";
    switch(module_id)
    {
      case 1:
        defaultColor="nfc-black";
        break;
      case 2:
        defaultColor="nfc-blue";
        break;
      case 3:
        defaultColor="nfc-purple";
          break;
      case 4:
        defaultColor="nfc-orange";
        break;
      case 5:
        defaultColor="nfc-red";
        break;
    }
    return defaultColor;
  }
}
