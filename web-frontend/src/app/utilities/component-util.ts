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
        snackBar.open(text, '', {
            duration: 2000,
            verticalPosition: placementFrom,
            horizontalPosition: placementAlign,
            panelClass: colorName,
        });
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
            duration: 200000,
            verticalPosition: placementFrom,
            horizontalPosition: placementAlign,
            panelClass: colorName
        });
    }
}