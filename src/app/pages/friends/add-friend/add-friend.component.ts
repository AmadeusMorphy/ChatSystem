import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { NgxImageCompressService } from 'ngx-image-compress';

@Component({
  selector: 'app-add-friend',
  templateUrl: './add-friend.component.html',
  styleUrls: ['./add-friend.component.scss']
})
export class AddFriendComponent {

  imgLoadingStates: boolean[] = [];
  users: any;
  isLoading = false;
  currentUserId: any;
  imgResultBeforeCompression: string = 'https://i.ibb.co/PgTRS4z/Pizigani-1367-Chart-10-MB.jpg'
  imgResultAfterCompression: string = 'https://i.ibb.co/PgTRS4z/Pizigani-1367-Chart-10-MB.jpg';

  constructor(
    private userService: UserService,
    private imageCompress: NgxImageCompressService
  ) {
    this.currentUserId = localStorage.getItem('userId');
  }

  ngOnInit(): void {
    this.getUsers();
    // this.compressFile()
  }

  getUsers() {
    this.isLoading = true
    this.userService.getData().subscribe(
      res => {
        this.users = res.filter((item: any) => {
          if(item.id === this.currentUserId) return false;
          // console.log(item.friendships?.some((item: any) => item.friendId));
          // console.log(this.currentUserId);
          
          if(item.friendships?.some((item: any) => item?.friendId === this.currentUserId)) return false;
          
          return true;
        })
        // console.log(this.users);
        this.isLoading = false;

        
        this.imgLoadingStates = new Array(this.users.length).fill(true);
      }, err => {
        this.isLoading = false;
        console.error("error stuff: ", err);
      }
    )
  }

  imgLoaded(index: number) {
    this.imgLoadingStates[index] = false;
  }

  sendReq(index: any) {
    console.log('You selected this: ', this.users[index]);
    const chosenFriend = this.users[index].id;
    console.log(chosenFriend);
    
    this.userService.sendReq(chosenFriend).subscribe(
      res => {
        console.log("Friend was added: ", res);
        
      }, err => {
        console.log('error stuff', err);
        
      }
    )
  }

//   compressFile() {
//     this.imageCompress.uploadFile().then(({image, orientation}) => {
//         this.imgResultBeforeCompression = image;
//         console.log('Size in bytes of the uploaded image was:', this.imageCompress.byteCount(image));

//         this.imageCompress
//             .compressFile(image, orientation, 50, 50) // 50% ratio, 50% quality
//             .then(compressedImage => {
//                 this.imgResultAfterCompression = compressedImage;
//                 console.log('Size in bytes after compression is now:', this.imageCompress.byteCount(compressedImage));
//             });
//     });
// }
}
