import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.css'
})
export class ImageUploadComponent {

  @Output() imageUploaded = new EventEmitter<any>();
  @Output() logoUploaded = new EventEmitter<any>();

  @Input() disabled: boolean = false;
  @Input() existantImage: string = null;
  @Input() filename: string = '';
  @Input() label: string = '';
  @Input() id: string = '';
  @Input() type: string = '';



  @Input() alt: string = '';
  selectedFile: string | null = null;



   /**
   * File upload handler to emit the base64 encoded image
   */
   fileChange(event: any): void {
    let fileList: any = event.target as HTMLInputElement;
    let file: File = fileList.files[0];
    if (file) {
      this.convertToBase64(file);
    }
  }

  /**
   * Convert file to base64
   */
  private convertToBase64(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      // Emit the result (base64 string) to the parent component
      this.selectedFile = reader.result as string
      if(this.type === 'logo'){
        console.log('logo');
        this.logoUploaded.emit({file: this.selectedFile, type: this.type});
      }
      else if(this.type === 'image') {
        this.imageUploaded.emit({file: this.selectedFile, type: this.type});

      }
    };
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
    };
    reader.readAsDataURL(file);
  }
}
