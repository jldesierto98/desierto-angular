import { FormControl, ValidationErrors } from "@angular/forms";

export class ValidatorsUtils {

    static notOnlyWhitespace(control: FormControl): ValidationErrors | null {
        const value = control.value as string; // Ensure the value is a string

        if ((control.value != null) && (control.value.trim().length === 0)) {
            return { notOnlyWhitespace: true }; // You can define a custom error key here
        } 

        else {
            return null;
        }

    }
}
