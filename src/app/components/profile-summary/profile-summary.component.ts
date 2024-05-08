import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-summary.component.html',
  styleUrl: './profile-summary.component.css'
})
export class ProfileSummaryComponent {
  token: string = '';
  userName:string='';
  role:string='';
  form!:FormGroup
  constructor(private fb: FormBuilder,private userService:UserService,private toastr: ToastrService,) {
    this.form = this.fb.group({
     
      image: [File, Validators.required],
    })
  }
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      this.role = (decoded as any).role;
      this.userName = (decoded as any).username;   
      console.log(this.role,typeof(this.role),this.userName,typeof(this.userName));
      
    } else {
      console.error('Token not found in localStorage');
    }
  }
  onfileselect(event:Event){
   // const file:File=(event.target as HTMLInputElement).files;
   const file = (event.target as HTMLInputElement).files?.[0];
   console.log(file);
   
   if (file) {
     // Check file type
     const fileType = file.type;
     if (!fileType.match(/image\/(png|jpg|jpeg|gif|tiff|bpg)/)) {
       this.form.get('image')?.setErrors({ 'image': true });
       return;
     }

     // Check file size
     const fileSize = file.size;
     const maxSizeInBytes = 20 * 1024 * 1024; // 20 MB

     if (fileSize > maxSizeInBytes) {
       this.form.get('image')?.setErrors({ 'size': true });
       return;
     }
this.form.patchValue({
  image:file.name
})
    
  }
  this.updateProfileImage()
}
updateProfileImage(){
    console.log(this.form.value);
    
    this.userService.uploadUserImage(this.form.value).subscribe({
      next:(res:any) => {
      console.log(res);
      this.toastr.success("uploaded image successfully");
      this.userService.update.next(true)
    },error:error=>{
      this.toastr.error("message error occured",error.message);
    }})
  
}
getErrorMessage(controlName: string): string {
  const control = this.form.get(controlName);


  if (control && control?.touched) {
    if (control && control.hasError('required')) {
      return 'This field is required';
    } else if (control && control.hasError('pattern')) {
      return 'Invalid pattern. Only alphanumeric characters are allowed';
    } else if (control && control.hasError('specialCharacter')) {
      return 'Special characters are not allowed';
    }
  } else if (control && control.hasError('image')) {
    return 'Invalid file type("*png,*jpg,*jpeg,*gif,*tiff,*bpg")';
  } else if (control && control.hasError('size')) {
    return 'File size exceeds 20MB limit.';
  }
  else if (control && control.hasError('specialCharacter')) {
    return 'Special characters are not allowed';
  }
  else if (control && control.hasError('image')) {
    return 'Invalid file type. Please upload an image of type PNG';
  }
  // Add more conditions for other validators as needed

  return '';
}
}