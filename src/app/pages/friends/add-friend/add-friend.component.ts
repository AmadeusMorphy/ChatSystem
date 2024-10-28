import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-add-friend',
  templateUrl: './add-friend.component.html',
  styleUrls: ['./add-friend.component.scss']
})
export class AddFriendComponent {

  imgLoadingStates: boolean[] = [];
  users: any;
  isLoading = false;
  
  constructor(
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.userService.getData().subscribe(
      res => {
        console.log(res);
        this.users = res;
        this.imgLoadingStates = new Array(this.users.length).fill(true);
      }
    )
  }

  imgLoaded(index: number) {
    this.imgLoadingStates[index] = false;
  }

  sendReq(index: any) {
    console.log('You selected this: ', this.users[index]);
    const chosenFriend = this.users[index].id;

    this.userService.addFriend(chosenFriend).subscribe(
      res => {
        console.log("Friend was added: ", res);
        
      }, err => {
        console.log('error stuff');
        
      }
    )
  }
}
