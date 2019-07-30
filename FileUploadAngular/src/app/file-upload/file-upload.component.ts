import { Component, OnInit } from '@angular/core';
import { FileUploadService } from './file-upload.service';
import { FileToUpload } from './file-to-upload';

// Maximum file upload size allowed: 2MB
const MAX_SIZE: number = 2097152;

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {
  theFile: any = null;
  messages: string[] = [];
  fileData: string[] = [];

  constructor(private uploadService: FileUploadService) { }

  ngOnInit() {
  }

  onFileChange(event) {
    this.theFile = null;
    if (event.target.files && 
        event.target.files.length > 0) {
      if(event.target.files[0].size < MAX_SIZE) {
        this.theFile = event.target.files[0];
      }
      else {
        this.messages.push("File: " + event.target.files[0].name + " is too large to upload.");
      }
    }
  }

  private readAndUploadFile(theFile: any) {
    const file = new FileToUpload();
        
    // Set File Information
    file.fileName = theFile.name;
    file.fileSize = theFile.size;
    file.fileType = theFile.type;
    file.lastModifiedTime = theFile.lastModified;
    file.lastModifiedDate = theFile.lastModifiedDate;
        
    // Use FileReader() object to get file to upload
    // NOTE: FileReader only works with newer browsers
    const reader = new FileReader();
        
    // Setup onload event for reader
    reader.onload = () => {
      // Store base64 encoded representation of file
      file.fileAsBase64 = reader.result.toString();
        
      // POST to server
      this.uploadService.uploadFile(file)
        .subscribe(resp => { 
          this.fileData.push(file.fileName);
          this.fileData.push(file.fileSize.toString());
          this.fileData.push(file.fileType.toString());
          this.fileData.push((new Date()).toLocaleString("en-AU"));
        });
    }
        
    // Read the file
    reader.readAsDataURL(theFile);
  }

  uploadFile(): void {
    this.readAndUploadFile(this.theFile);
  }

}
