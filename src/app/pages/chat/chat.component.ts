import { Component, OnInit, OnDestroy } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { UserService } from '../services/user.service';
import { forkJoin } from 'rxjs';

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
  fakeUsers = [
    { id: 1, name: 'User1', status: 'Online', profileImage: 'https://via.placeholder.com/50' },
    { id: 2, name: 'User2', status: 'Offline', profileImage: 'https://via.placeholder.com/50' },
    { id: 3, name: 'User3', status: 'Online', profileImage: 'https://via.placeholder.com/50' },
    // Add more users as needed
  ];

  selectedUser: string = '';
  private subscription: any;
  currentUserId: any;
  messageId: string = ''

  friends: any;
  friendsBlock: any;

  constructor(
    private supabase: SupabaseService,
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {
    this.currentUserId = localStorage.getItem('userId');
    this.messageForm = this.formBuilder.group({
      content: ['', Validators.required],
      sender: this.currentUserId
    });
  }

  ngOnInit() {
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
    this.userService.getCurrentUserData().subscribe(
      res => {
        console.log(res);
        
        const counter = res[0].friendships?.length;
        const userRequests = [];

        for (let i = 0; i < counter; i++) {
          const chosenUser = res[0].friendships[i]?.friendId;
          userRequests.push(this.userService.getUserById(chosenUser));
        }

        // Use forkJoin to wait for all requests to finish
        forkJoin(userRequests).subscribe(
          (userResponses: any[]) => {

            this.friendsBlock = userResponses;
            console.log("Friends Block: ", this.friendsBlock);
            
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
    const { data, error } = await this.supabase.getMessages(this.messageId);
    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      this.messages = data;
    }
  }

  subscribeToMessages() {
    this.subscription = this.supabase.subscribeToMessages().subscribe(
      (newMessage) => {
        this.messages.push(newMessage);
      },
      (error) => {
        console.error('Error in message subscription:', error);
      }
    );
  }

  async sendMessage() {
    if (this.messageForm.valid) {
      const content = this.messageForm.get('content')?.value;
      const { data, error } = await this.supabase.sendMessage(content, this.selectedUser);
      if (error) {
        console.error('Error sending message:', error);
      } else {
        this.messageForm.reset();
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
    this.selectedUser = user[0].id
    this.messageId = user[0].id
    console.log('Selected user:', this.messageId);
    this.filterSelectedFriend(this.messageId)
    // Handle user selection logic here
  }
}