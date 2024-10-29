import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-user-friends',
  templateUrl: './user-friends.component.html',
  styleUrls: ['./user-friends.component.scss']
})
export class UserFriendsComponent {

  users: any;
  friendsBlock: any;
  imgLoadingStates: boolean[] = [];
  isLoading = true;

  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.getFriends();
  }

  getFriends() {
    this.userService.getCurrentUserData().subscribe(
      res => {
        console.log(res);

        const counter = res[0].friendships?.length;
        const userRequests = [];

        for (let i = 0; i < counter; i++) {
          const chosenUser = res[0].friendships[i]?.friendId;
          userRequests.push(this.userService.getUserById(chosenUser));
        }

        forkJoin(userRequests).subscribe(
          (userResponses: any) => {

            this.users = userResponses.map((item: any) => item[0]);
            this.imgLoadingStates = new Array(this.users.length).fill(true);

            console.log("Friends Block: ", this.users);

          },
          (error) => {
            console.error('Error fetching user data: ', error);

          }
        );
      },
      (error) => {
        console.error("Error fetching current user data: ", error);
      }
    )
  }


  imgLoaded(index: number) {
    this.imgLoadingStates[index] = false;
  }

  selectUser(index: any) {
    console.log('You selected this: ', index);

  }
}
