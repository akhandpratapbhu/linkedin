import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { PostService } from '../../services/post.service';
import { FriendRequestComponent } from '../friend-request/friend-request.component';
import { MatDialog } from '@angular/material/dialog';
import { ConnectionProfileService } from '../../services/connection-profile.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, map, of, startWith } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ChatComponent } from '../chat/chat.component';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule, FriendRequestComponent, CommonModule,RouterModule,
    FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, AsyncPipe,ChatComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  imageUrl!: string;
  token: string = '';
  userName: string = '';
  users: any = [];
  AllGetfriendRequest: any
  gettotalfriendRequest: number = 0;
  searchQuery: string = '';
  myControl = new FormControl('');
  filteredOptions!: Observable<string[]>;
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private userService: UserService,
    private postService: PostService,
    private connectionProfileService: ConnectionProfileService,
    public dialog: MatDialog,
  ) {

  }

  ngOnInit(): void {

    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      this.userName = (decoded as any).username;
    } else {
      console.error('Token not found in localStorage');
    }



    this.postService.imageUrl.subscribe(imageUrl => {
      // Handle the emitted imageUrl here
      if (imageUrl) {
        this.imageUrl = imageUrl;

      }
      else {
        this.imageUrl = this.userService.getDefaultfullImagePath()

      }

    });
    this.ReceiveFriendRequest();
    this.loadFriendRequests();
  }

  private _filterUsers(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.users
      .filter((user: { username: string; }) => user.username.toLowerCase().includes(filterValue))
      .map((user: { username: any; }) => user.username); // Extract usernames from filtered user objects
  }

  onSearch() {
    // Implement your search logic here using this.searchQuery

    this.userService.getUserByUserName(this.searchQuery).subscribe(users => {
      if (Array.isArray(users)) {
        this.users = users;

      }
      console.log("this.users",this.users);

      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterUsers(value || '')),
      );

    });
  }
  onOptionSelected(selectedValue: string) {
    console.log('Selected value:', selectedValue);
    // Perform actions based on the selected value
      this.router.navigate([`searchUserProfile/${selectedValue}`])
    
  }
  chatDialogBox(){
    this.router.navigate(['chat'])
  }


  loadFriendRequests() {
    const savedRequests = localStorage.getItem('friendRequests');
    if (savedRequests) {
      this.AllGetfriendRequest = JSON.parse(savedRequests);
      this.gettotalfriendRequest = this.AllGetfriendRequest.length;
    }
  }
  saveFriendRequests() {
    localStorage.setItem('friendRequests', JSON.stringify(this.AllGetfriendRequest));
  }
  ReceiveFriendRequest() {
    this.connectionProfileService.getFriendRequest().subscribe(res => {
      if (Array.isArray(res)) {
        // Filter friend requests by 'pending' status (or any status you need)
        this.AllGetfriendRequest = res.filter(request => request.status === 'pending');
        console.log("Filtered friend requests", this.AllGetfriendRequest);
        this.gettotalfriendRequest = this.AllGetfriendRequest.length;
        console.log("Total friend requests", this.gettotalfriendRequest);
        this.saveFriendRequests(); // Save to localStorage after filtering
      } else {
        console.error("Received data is not an array", res);
      }
    });
  }
  checkAndOpenDialogBox(): void {
    if (this.gettotalfriendRequest > 0) {
      this.openDialogBox();
    } else {
      console.log('No friend requests to show');
    }
  }

  openDialogBox(): void {
    this.dialog.open(FriendRequestComponent, {

      width: '450px',
      height: 'auto',
      data: this.AllGetfriendRequest,
    }).afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      this.gettotalfriendRequest = result.length;
      this.AllGetfriendRequest = result
      this.saveFriendRequests();
    });
  }

  SignOut() {

    console.log('Signing out...');
    localStorage.clear();
    this.toastr.success("user login out successfully...");
    this.router.navigate([""]);
  }
}
