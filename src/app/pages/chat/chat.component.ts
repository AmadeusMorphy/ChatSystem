import { Component, OnInit, OnDestroy } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';

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
  private subscription: any;
  currentUserId: string | undefined;

  constructor(
    private supabase: SupabaseService,
    private formBuilder: FormBuilder
  ) {
    this.messageForm = this.formBuilder.group({
      content: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadMessages();
    this.subscribeToMessages();
    this.getCurrentUser();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  async loadMessages() {
    const { data, error } = await this.supabase.getMessages();
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
      const { data, error } = await this.supabase.sendMessage(content);
      if (error) {
        console.error('Error sending message:', error);
      } else {
        this.messageForm.reset();
      }
    }
  }

  async getCurrentUser() {
    const { data: { user } } = await this.supabase.getCurrentUser();
    this.currentUserId = 'user123';
  }

  isOwnMessage(message: any): boolean {
    return message.sender === this.currentUserId;
  }
}