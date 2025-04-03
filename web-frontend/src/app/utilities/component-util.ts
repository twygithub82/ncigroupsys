import { MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition, MatSnackBar } from "@angular/material/snack-bar";

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
}