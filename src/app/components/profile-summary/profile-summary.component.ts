import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-profile-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-summary.component.html',
  styleUrl: './profile-summary.component.css'
})
export class ProfileSummaryComponent {
  token: string = '';
  userName: string = '';
  role: string = '';
  imageUrl: any;
  img!: string
  form!: FormGroup
  image: any;
  
  constructor(private fb: FormBuilder, private userService: UserService, private toastr: ToastrService,
     private postService: PostService) {
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

    } else {
      console.error('Token not found in localStorage');
    }
    //  this.profilePicture();
     this.loadProfileImage();
    this.postService.imageUrl.subscribe(imageUrl => {
      // Handle the emitted imageUrl here
      if(imageUrl){
        this.imageUrl = imageUrl;
      } 
        else {
          this.imageUrl = this.userService.getDefaultfullImagePath()
        
      }

    });

  }
  // profilePicture() {
  //   this.userService.getProfileImageName().subscribe(res => {
  //     if (res) {
  //       this.image = res;
  //       this.imageUrl = this.userService.getfullImagePath(this.image.image)

  //     } else {
  //       const defaultImgPath = 'user.png'
  //       this.userService.uploadUserImage(defaultImgPath).subscribe()
  //     }
  //   })
  // }
  onfileselect(event: Event) {
    // const file:File=(event.target as HTMLInputElement).files;
    const file = (event.target as HTMLInputElement).files?.[0];
    // console.log(file);

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
        image: file
      })

    }
    this.updateProfileImage()
  }
  updateProfileImage() {
    // console.log(this.form.value);
    const formData = new FormData();
    formData.append('file', this.form.get('image')?.value);
    console.log(this.form.get('image')?.value);

    this.userService.uploadUserImage(formData).subscribe({
      next: (res: any) => {
        this.img = res.img;
        this.toastr.success("uploaded image successfully");

        this.loadProfileImage();
       // this.userService.update.next(true)

      }, error: error => {
        this.toastr.error("message error occured", error.message);
      }
    })

  }

  loadProfileImage() {
    if (this.img) {
      this.imageUrl = this.userService.getfullImagePath(this.img)
    }
    else {
      this.imageUrl = this.userService.getDefaultfullImagePath()
    }

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