import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { UserService } from '../../services/user.service';
import { ConnectionProfileService } from '../../services/connection-profile.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-connection-profile',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './connection-profile.component.html',
  styleUrl: './connection-profile.component.css'
})
export class ConnectionProfileComponent {

  authorId!: string | null;
  data = {}
  imagePath!: string
  userName!:string
  constructor(private userService: UserService, private connectionProfile: ConnectionProfileService, private route: ActivatedRoute) {

  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.authorId = params.get('id'); // The 'id' here should match the parameter in your route definition
      console.log('Author ID:', this.authorId);
    });
    this.getConnectionUserProfile(this.authorId)
    this.getFriendRequestStatus(this.authorId)
  }
  getConnectionUserProfile(id: any) {
    this.connectionProfile.getConnectionUser(id).subscribe(res => {

      this.data = res
      if (this.data && Array.isArray(this.data) && this.data.length > 0) {
        const imagePath = this.data[0].image; 
        this.userName=this.data[0].username
        // Access the image property from the first object
        console.log("Image Path:", imagePath);

        if (imagePath) {
          this.imagePath = this.userService.getfullImagePath(imagePath);
        }
      }
    })
  }
  getFriendRequestStatus(id:any){
    this.connectionProfile.getFriendRequestStatus(id).subscribe(res=>{
      console.log(res);
      
    })
  }
  addUser(){
    this.connectionProfile.addConnectionUser(this.authorId).subscribe(res=>{
      console.log(res);
      
    })
  }
}
