import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { PostService } from '../../services/post.service';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule,MatIconModule,FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {

  token: string = '';
  userName: string = '';
  role: string = '';
  imageUrl: any;
  img!: string
  form!: FormGroup
  image: any;
  users: any
  backgroundimage: any;
  backgroundimageUrl: any;
  phoneNumber:any
  email!:string
  datamessage!:string
  picture:any
  constructor(private fb: FormBuilder, private userService: UserService, private toastr: ToastrService,
    private postService: PostService) {
    this.form = this.fb.group({

      image: [File, Validators.required],
      backgroundimage: [File, Validators.required],
    })
  }
  ngOnInit(): void {
 
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      this.role = (decoded as any).role;
      this.userName = (decoded as any).username;
      const image = (decoded as any).image
      if (image) {
        this.picture = image
      }
      this.findUser(this.userName)
    } else {
      console.error('Token not found in localStorage');
    }
    this.loadProfileImage();
   

  }
  findUser(username: string) {
    
    this.userService.getUserByUserName(username).subscribe((res) => {
      this.users = res;
      console.log(this.users);
      
      if (this.users) {
        
        this.img = this.users[0].image
        this.imageUrl = this.img;
        this.backgroundimage = this.users[0].backgroundimage
        this.backgroundimageUrl=this.backgroundimage
        this.email= this.users[0]?.email
        this.phoneNumber= this.users[0]?.phoneNumber
       this.loadProfileImage();
      }
      else {
        this.imageUrl = this.userService.getDefaultfullImagePath()

      }
      
    });
  }
  onfileselect(event: Event) {
    // const file:File=(event.target as HTMLInputElement).files;
    const file = (event.target as HTMLInputElement).files?.[0];

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
  onbackgroundfileselect(event: Event) {
    // const file:File=(event.target as HTMLInputElement).files;
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      // Check file type
      const fileType = file.type;
      if (!fileType.match(/image\/(png|jpg|jpeg|gif|tiff|bpg)/)) {
        this.form.get('backgroundimage')?.setErrors({ 'backgroundimage': true });
        return;
      }

      // Check file size
      const fileSize = file.size;
      const maxSizeInBytes = 20 * 1024 * 1024; // 20 MB

      if (fileSize > maxSizeInBytes) {
        this.form.get('backgroundimage')?.setErrors({ 'size': true });
        return;
      }
      this.form.patchValue({
        backgroundimage: file
      })

    }
    this.updatebackgroundImage()
  }
  updatebackgroundImage() {
    const formData = new FormData();

    formData.append('file', this.form.get('backgroundimage')?.value);

    this.userService.uploadUserbackgroundImage(formData).subscribe({
      next: (res: any) => {
        this.backgroundimage= res.img;

        this.toastr.success("uploaded image successfully");

        this.loadProfileImage();
        // this.userService.update.next(true)

      }, error: error => {
        this.toastr.error("message error occured", error.message);
      }
    })

  }
  updateProfileImage() {
    const formData = new FormData();
    formData.append('file', this.form.get('image')?.value);
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
      this.userService.setImageUrl(this.imageUrl)
    }
    else {
      this.imageUrl = this.userService.getDefaultfullImagePath()
    }
    if (this.backgroundimage) {
      this.backgroundimageUrl = this.userService.getfullImagePath(this.backgroundimage)
    }
    else {
      this.backgroundimageUrl = this.userService.getDefaultfullImagePath()
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
