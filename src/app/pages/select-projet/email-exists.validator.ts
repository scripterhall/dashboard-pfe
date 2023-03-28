import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Membre } from 'src/app/model/membre';




export function emailExistsValidator(members: Membre[]): ValidatorFn {
    return (control: FormControl): ValidationErrors | null => {
        
      const email = control.value;
      if(members.length == 0)
        return null;

      const member = members.find((m) => m.email === email);
      return member ? { emailExists: true } : null;
    };
  }



  export function emailValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const email: string = control.value;
    if (email && email.indexOf('@') !== -1 && email.indexOf('.', email.indexOf('@')) !== -1) {
      return null;
    } else {
      return { 'invalidEmail': true };
    }
  }