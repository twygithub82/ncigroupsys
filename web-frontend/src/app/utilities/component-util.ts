import { MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition, MatSnackBar } from "@angular/material/snack-bar";
import { CustomSnackbarComponent } from "@shared/components/custom-snackbar/custom-snackbar";

export class ComponentUtil {
    static showNotification(
        colorName: string,
        text: string,
        placementFrom: MatSnackBarVerticalPosition,
        placementAlign: MatSnackBarHorizontalPosition,
        snackBar: MatSnackBar
    ) {
        // snackBar.open(text, '', {
        //     duration: 2000,
        //     verticalPosition: placementFrom,
        //     horizontalPosition: placementAlign,
        //     panelClass: colorName,
        // });
        let finalIcon = 'check_circle';
        if (colorName === 'snackbar-success') {
            finalIcon = 'check_circle';
        } else if (colorName === 'snackbar-error') {
            finalIcon = 'error';
        } else if (colorName === 'snackbar-info') {
            finalIcon = 'info';
        } else if (colorName === 'snackbar-warning') {
            finalIcon = 'warning';
        }

        this.showCustomNotification(finalIcon, colorName, text, placementFrom, placementAlign, snackBar);
    }

    static showCustomNotification(
        icon: string,
        colorName: string,
        message: string,
        placementFrom: MatSnackBarVerticalPosition,
        placementAlign: MatSnackBarHorizontalPosition,
        snackBar: MatSnackBar
    ) {
        snackBar.openFromComponent(CustomSnackbarComponent, {
            data: { icon, message },
            duration: 2000,
            verticalPosition: placementFrom,
            horizontalPosition: placementAlign,
            panelClass: colorName
        });
    }
}