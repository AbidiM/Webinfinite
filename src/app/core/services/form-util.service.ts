/* eslint-disable @typescript-eslint/no-explicit-any */
import { ElementRef, Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Injectable({
    providedIn: 'root'
})
export class FormUtilService{

    /**
   * Focuses on the first invalid control in the form.
   * @param form The FormGroup instance to check for invalid controls.
   */
 focusOnFirstInvalid(form: FormGroup): void {
    const firstInvalidControl = this.getFirstInvalidControl(form);
    if (firstInvalidControl) {
      firstInvalidControl.focus();
    }
  }

  /**
   * Finds the first invalid control in the form.
   * @param form The FormGroup instance to check for invalid controls.
   * @returns The first invalid control element or null if none found.
   */
  getFirstInvalidControl(form: FormGroup): HTMLInputElement | null {
    const controls = form.controls;
    for (const key in controls) {
      if (controls[key].invalid) {
        const inputElement = document.getElementById(key) as HTMLInputElement;
        if (inputElement) {
          return inputElement;
        }
      }
    }
    return null;
  }
   /**
   * Checkes for changed Fields.
   * @param form The FormGroup instance  and the originl Data to be compared with.
   * @returns The only changes fields in an object.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  detectChanges<T>(form: FormGroup, data: T): Partial<T> {
    const changedData: Partial<T> = {};

    // Compare each field and add only the modified fields
    for (const key in form.controls) {
      if (form.controls[key].dirty) {
        // Check if the value is different from the original
        if (form.controls[key].value !== data[key]) {
            changedData[key] = form.controls[key].value;
        }
      }
    }
    console.log(changedData);
    return changedData;
  }
/**
 * Scroll Up to the Top of the Form to show the warning message
 * @param formElement 
 */
  scrollToTopOfForm(formElement: ElementRef): void {
    // First, scroll to the form element (or to the input element at the top)
    if (formElement) {
     
        window.scrollTo({
        top: formElement.nativeElement.offsetTop - 50, // Scroll position minus offset for margin/padding if needed
        behavior: 'smooth', // Smooth scroll
      });
    }

    
  }
  /***
   * Creates Translated Objects
   */
  createTranslation (formValue: any,language: string, fields: {field: string, name: string}[]): any  {
    const translation: any = { language };

    fields.forEach(({ field, name }) => {
      if (formValue[field]) {
        translation[name] = formValue[field];
      }
    });
    // Only return the translation if it has at least one valid property (other than 'language')
    return Object.keys(translation).length > 1 ? translation : null;
  }
}