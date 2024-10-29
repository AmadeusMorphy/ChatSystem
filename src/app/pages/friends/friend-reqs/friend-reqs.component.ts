import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-friend-reqs',
  templateUrl: './friend-reqs.component.html',
  styleUrls: ['./friend-reqs.component.scss']
})
export class FriendReqsComponent {

  imgLoadingStates: boolean[] = [];
  users: any;
  isLoading = false;
  counter: any;
  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.getUserData()
  }

  getUserData() {
    this.getReqs()
  }

  getReqs() {

    this.userService.getCurrentUserData().subscribe(
      res => {
        console.log(res);

        this.counter = res[0].friendReqs?.length;


        const userRequests = [];

        for (let i = 0; i < this.counter; i++) {
          const chosenUser = res[0].friendReqs[i]?.userId;
          userRequests.push(this.userService.getUserById(chosenUser));
        }

        // Use forkJoin to wait for all requests to finish
        forkJoin(userRequests).subscribe(
          (userResponses: any) => {

            this.users = userResponses;
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

  acceptReq(index: any) {
    console.log(this.users[0][index].id);
    const chosenFriend = this.users[0][index].id
    this.userService.addFriend(chosenFriend).subscribe(
      res => {
        console.log("friend req accepted: ", res);
        this.users.splice(index, 1);

        this.counter = this.users.length;
      }, err => {
        console.error("error stuff: ", err);
      }
    )
  }
}
