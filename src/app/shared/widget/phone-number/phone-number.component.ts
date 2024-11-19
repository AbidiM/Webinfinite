/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Input, Output, AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import intlTelInput from 'intl-tel-input';
 import ar from 'intl-tel-input/i18n/ar';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-phone-number',
  templateUrl: './phone-number.component.html',
  styleUrl: './phone-number.component.css'
})
export class PhoneNumberComponent implements AfterViewInit {
  
  @Output() phoneNumberChanged = new EventEmitter<string>();
  @Input() initialPhoneNumber: string;
  @Input() disabled: boolean = false;
  @Input() inputId: string ;
  @Input() placeholder: string;
  inputElement: HTMLInputElement;
  language: string = '';
  phone: FormControl; 
  itiOptions: any = {};

  constructor(private formBuilder: FormBuilder, private cookieService: CookieService) {
    this.phone = this.formBuilder.control(''); // Initialize the phone control
    this.itiOptions = {
      initialCountry: 'sa', // set default country as Saudi Arabia
      utilsScript: 'node_modules/intl-tel-input/build/js/utils.js', // for validation and formatting
    };

  }

  checkLanguageAndApplyRtl(): void {
    this.language = this.cookieService.get('lang'); 
    console.log(this.language)
    if (this.language === 'ar') {
      this.inputElement.setAttribute('dir', 'rtl'); 
      this.itiOptions.i18n = ar; 
    } 
    else {
      this.inputElement.setAttribute('dir', 'ltr');
      delete this.itiOptions.i18n;
    }
    console.log(this.itiOptions);
  }

  ngAfterViewInit() {

    this.inputElement = document.querySelector(`#${this.inputId}`) as HTMLInputElement; 
    this.checkLanguageAndApplyRtl();
    const iti = intlTelInput(this.inputElement, this.itiOptions);

    if (this.initialPhoneNumber) {
      this.inputElement.value = this.initialPhoneNumber;
      iti.setNumber( this.initialPhoneNumber);
    }
    this.inputElement.addEventListener('input', () => {
      const phoneNumber = this.inputElement.value;
      this.phoneNumberChanged.emit(phoneNumber);
    });
 

  }
  
}