//https://alligator.io/angular/reactive-forms-custom-validator/

import { AbstractControl } from '@angular/forms';

export function ValidateUrl(control: AbstractControl) {
    if (control.value) {
        if (!control.value.startsWith('https://www.marinetraffic.com/en/ais/details/ships')) {
            return { validUrl: true };
        }
    }
    return null; //on returning null form is happy!
}