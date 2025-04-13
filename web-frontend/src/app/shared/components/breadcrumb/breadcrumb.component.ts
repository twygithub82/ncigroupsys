import { Component, Input } from '@angular/core';
import { FeatherIconsComponent } from '../feather-icons/feather-icons.component';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';

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
  items!: any[];
  @Input()
  active_item!: string;

  constructor(private router: Router, private route: ActivatedRoute) { }

  isString(value: any): boolean {
    return typeof value === 'string';
  }

  onClickBreadcrumbs(route: any, queryParams: any, historyState: any) {
    this.router.navigate([route], {
      queryParams: queryParams,
      state: historyState,
    });
  }
}
