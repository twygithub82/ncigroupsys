import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class TlxMatPaginatorIntl extends MatPaginatorIntl {
    constructor(private translate: TranslateService) {
        super();
    }
    override getRangeLabel = (page: number, pageSize: number, length: number): string => {
        const totalPages = Math.ceil(length / pageSize);
        const pageLabel = this.translate.instant('COMMON-FORM.PAGE'); // resolved string
        return `${pageLabel} ${page + 1} of ${totalPages}`;
    };
}