import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

interface Message {
  id: number;
  content: string;
  user_id: string;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async getMessages() {
    return await this.supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });
  }

  subscribeToMessages(): Observable<Message> {
    return new Observable((observer) => {
      const subscription = this.supabase
        .channel('public:messages')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
          observer.next(payload.new as Message);
        })
        .subscribe();

      return () => {
        this.supabase.removeChannel(subscription);
      };
    });
  }

  async sendMessage(content: string) {
    const { data: { user } } = await this.supabase.auth.getUser();
    return await this.supabase.from('messages').insert({
      content,
      sender: 'user123'
    });
  }

  async getCurrentUser() {
    return await this.supabase.auth.getUser();
  }
}