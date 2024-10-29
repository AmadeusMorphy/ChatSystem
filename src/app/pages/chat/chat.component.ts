import { Component, OnInit, OnDestroy } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { UserService } from '../services/user.service';
import { forkJoin } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { MessageService } from 'primeng/api';
import { ImageUploadChatService } from '../services/image-upload-chat.service';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  animations: [
    trigger('messageAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ChatComponent implements OnInit, OnDestroy {
  messages: any[] = [];
  messageForm: FormGroup;
  isInboxVisible: boolean = true;
  isMobileView: boolean = false;
  selectedUser: any = null;
  private subscription: any;
  currentUserId: any;
  messageId: string = ''
  isMessages: any;
  friends: any;
  friendsBlock: any;
  isSending = false;
  showMessage = false;
  openedChat: any;
  isChatLoading = false;
  isUsersLoading = false;
  uploadedFiles: any[] = [];
  previewUrl: string | null = null;

  skeletons = [
    { width: '20rem', height: '5rem', styleClass: 'mb-2 ml-auto' },
    { width: '10rem', height: '3rem', styleClass: 'mb-2' },
    { width: '6rem', height: '3rem', styleClass: 'mb-2 ml-auto' },
    { width: '30rem', height: '8rem', styleClass: 'mb-2' },
    { width: '10rem', height: '4rem' },
    { width: '16rem', height: '7rem', styleClass: 'mb-2 ml-auto' },
    { width: '10rem', height: '4rem', styleClass: 'mb-2 ml-auto' }
  ];

  shuffledSkeletons = [...this.skeletons];

  constructor(
    private supabase: SupabaseService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private messageService: MessageService,
    private imageService: ImageUploadChatService
  ) {
    this.currentUserId = localStorage.getItem('userId');
    this.messageForm = this.formBuilder.group({
      content: ['', Validators.required],
      sender: this.currentUserId
    });
  }

  ngOnInit() {
    this.isMobileView = window.innerWidth <= 770;
    window.addEventListener('resize', () => {
      this.isMobileView = window.innerWidth <= 770;
    });

    this.loadMessages();
    this.subscribeToMessages();
    this.getCurrentUser();
    this.getFriends()
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getFriends() {
    this.isUsersLoading = true;

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
          (userResponses: any[]) => {

            this.friendsBlock = userResponses;
            console.log("Friends Block: ", this.friendsBlock);
            this.isUsersLoading = false;
          },
          (error) => {
            console.error('Error fetching user data: ', error);
            this.isUsersLoading = false;
          }
        );

      },
      (error) => {
        this.isUsersLoading = false;
        console.error("Error fetching current user data: ", error);
      }
    )
  }

  filterSelectedFriend(selectedId: string) {
    this.userService.getCurrentUserData().subscribe(
      res => {
        const test = res[0].friendships.filter((item: any) => item.friendId === selectedId)[0].messagesId
        console.log('FILTERED THIS: ', test);
        this.messageId = test;
        this.loadMessages();
        this.subscribeToMessages()
      }
    )
  }
  async loadMessages() {
    this.isChatLoading = true;

    const { data, error } = await this.supabase.getMessages(this.messageId);
    if (error) {
      console.error('Error fetching messages:', error);
      this.isChatLoading = false;
    } else {
      console.log("DATA: ", data);
      
      this.messages = data;
      this.isMessages = this.messages.length
      this.isChatLoading = false;
    }
  }
  subscribeToMessages() {
    this.subscription = this.supabase.subscribeToMessages().subscribe(
      (newMessage) => {
        // Only add if the message does not already exist
        const messageExists = this.messages.some((msg) => msg.id === newMessage.id);

        if (!messageExists) {
          this.messages.push(newMessage);
        }
      },
      (error) => {
        console.error('Error in message subscription:', error);
      }
    );
  }


  async sendMessage() {
    this.isSending = true;
    const theImage = this.previewUrl;
    this.previewUrl = null;
    if (this.messageForm.valid) {
        const content = this.messageForm.get('content')?.value;
        
        // Show the temporary message before the backend starts
        const tempMessage = {
            id: uuidv4(),
            content: content,
            sender_id: this.currentUserId,
            timestamp: new Date(),
            images_url: theImage,  // Include the preview URL here
            isTemporary: true
        };

        this.messages.push(tempMessage);
        this.messageForm.reset();
        
        try {
            // Send the message to the backend
            const { data, error } = await this.supabase.sendMessage(content, this.selectedUser, theImage); // Pass the image URL
            
            if (error) {
                console.error('Error sending message:', error);
                // Handle error by removing the temporary message
                this.messages = this.messages.filter((msg) => msg !== tempMessage);
            } else {
                this.isSending = false;
                // Replace the temporary message with the saved message data from the backend
                this.subscribeToMessages()
                Object.assign(tempMessage, data, { isTemporary: false });
            }
        } catch (err) {
            console.error('Unexpected error:', err);
            this.messages = this.messages.filter((msg) => msg !== tempMessage);
        }
    }
}



  async getCurrentUser() {
    const { data: { user } } = await this.supabase.getCurrentUser();
    this.currentUserId = localStorage.getItem('userId');
  }

  isOwnMessage(message: any): boolean {
    return message.sender_id === this.currentUserId;
  }

  selectUser(user: any) {
    this.shuffleSkeletons();
    this.isChatLoading = true;
    this.messageId = user[0].id;
    this.filterSelectedFriend(this.messageId);
    this.selectedUser = user[0].id
    this.isInboxVisible = false;
    this.openedChat = user[0]
    console.log('Selected user:', user[0]);
  }

  toggleInboxView() {
    this.selectedUser = null;
    this.isInboxVisible = !this.isInboxVisible;
  }

  shuffleSkeletons() {
    this.shuffledSkeletons = [...this.skeletons]
      .sort(() => Math.random() - 0.5);
  }
  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onUpload(event: any) {
    for (let file of event.files) {
      this.uploadedFiles.push(file); // Store uploaded files in the array
      this.uploadImageToImgBB(file);
    }
  }


  uploadImageToImgBB(file: File): void {
    this.imageService.uploadImage(file).subscribe(
      response => {
        if (response && response.data && response.data.url) {
          console.log('Image uploaded successfully:', response.data.url);
          this.messageService.add({ severity: 'success', summary: 'File Uploaded', detail: 'Image uploaded successfully!' });
        }
      },
      error => {
        console.error('Upload failed:', error);
        this.messageService.add({ severity: 'error', summary: 'Upload Failed', detail: 'Could not upload image.' });
      }
    );
  }
}