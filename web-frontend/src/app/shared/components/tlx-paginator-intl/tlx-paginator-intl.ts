import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
// export class TlxMatPaginatorIntl extends MatPaginatorIntl {
//     constructor(private translate: TranslateService) {
//         super();
//     }
//     override getRangeLabel = (page: number, pageSize: number, length: number): string => {
//         const totalPages = Math.ceil(length / pageSize);
//         const pageLabel = this.translate.instant('COMMON-FORM.PAGE'); // resolved string
//         return `${pageLabel} ${page + 1} of ${totalPages}`;
//     };
// }

export class TlxMatPaginatorIntl extends MatPaginatorIntl {
    constructor(private translate: TranslateService) {
        super();

        this.translate.onLangChange.subscribe(() => {
            this.refreshLabels();
        });

        // Wait for translations to load before first use
        this.translate.get('COMMON-FORM.PAGE').subscribe(() => {
            this.refreshLabels();
        });
    }

    override getRangeLabel = (page: number, pageSize: number, length: number): string => {
        const totalPages = Math.ceil(length / pageSize);
        const pageLabel = this.translate.instant('COMMON-FORM.PAGE');
        return `${pageLabel} ${page + 1} of ${totalPages}`;
    };

    private refreshLabels(): void {
        this.changes.next(); // triggers Angular to re-render paginator
    }
}