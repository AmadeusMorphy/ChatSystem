import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

interface Message {
  id: number;
  content: string;
  user_id: string;
  created_at: string;
  images_url: string;
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  messagesId: string = ''
  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async getMessages(messageID: string) {
    this.messagesId = messageID;
    return await this.supabase
      .from(messageID)
      .select('*')
      .order('created_at', { ascending: true });
  }

  subscribeToMessages(): Observable<Message> {
    return new Observable((observer) => {
      const subscription = this.supabase
        .channel(`public:${this.messagesId}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: this.messagesId }, (payload) => {
          observer.next(payload.new as Message);
        })
        .subscribe();

      return () => {
        this.supabase.removeChannel(subscription);
      };
    });
  }

  async sendMessage(content: string, receiverId: string) {
    const { data: { user } } = await this.supabase.auth.getUser();
    return await this.supabase.from(this.messagesId).insert({
      content,
      sender_id: localStorage.getItem('userId'),
      receiver_id: receiverId
    });
  }

  async getCurrentUser() {
    return await this.supabase.auth.getUser();
  }
}