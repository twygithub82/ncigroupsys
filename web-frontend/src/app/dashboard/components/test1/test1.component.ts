import { Component } from '@angular/core';
import { BreadcrumbComponent } from 'app/shared/components/breadcrumb/breadcrumb.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {SingletonNotificationService,MessageItem} from '@core/service/singletonNotification.service';
@Component({
  selector: 'app-test1',
  templateUrl: './test1.component.html',
  styleUrls: ['./test1.component.scss'],
  standalone: true,
  imports: [
    BreadcrumbComponent,
    MatProgressSpinnerModule
  ],
})
export class Test1Component {

  msgReceived: string = '';
  constructor(private notificationService: SingletonNotificationService) {
    this.initializeSubscription();
  }

  initializeSubscription() {
    this.notificationService.subscribe('test1', (message: MessageItem) => {
      // Handle the message here
      this.msgReceived = `${new Date().toLocaleString(undefined, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })} message Received`;
      console.log(this.msgReceived);
    });
  }

}
