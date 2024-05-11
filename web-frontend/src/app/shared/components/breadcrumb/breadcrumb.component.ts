import { Component, Input } from '@angular/core';
import { FeatherIconsComponent } from '../feather-icons/feather-icons.component';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.scss'],
    standalone: true,
    imports: [RouterLink, FeatherIconsComponent, TranslateModule],
})
export class BreadcrumbComponent {
  @Input()
  title!: string;
  @Input()
  items!: string[];
  @Input()
  active_item!: string;

  constructor() { }
}
