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

  async getMessages(messageID: string, limit: number = 18) {
    this.messagesId = messageID;
    
    // First, get the total count of messages
    const { count, error: countError } = await this.supabase
      .from(messageID)
      .select('*', { count: 'exact', head: true });
  
    if (countError) {
      console.error('Error fetching message count:', countError);
      return { data: null, error: countError };
    }
  
    // Handle potential null count
    const totalCount = count ?? 0;
  
    // Calculate the starting point for our query
    const start = Math.max(0, totalCount - limit);
  
    // Now, fetch the last 'limit' number of messages
    const { data, error } = await this.supabase
      .from(messageID)
      .select('*')
      .order('created_at', { ascending: true })
      .range(start, totalCount - 1);
  
    if (error) {
      console.error('Error fetching messages:', error);
      return { data: null, error };
    }
  
    // The data is already in the correct order (oldest to newest)
    return { data, error: null };
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

  async sendMessage(content: string, receiverId: string, images_url: string | null) {
    const { data: { user } } = await this.supabase.auth.getUser();
    return await this.supabase.from(this.messagesId).insert({
        content,
        sender_id: localStorage.getItem('userId'),
        receiver_id: receiverId,
        images_url: images_url // Save the image URL
    });
}

  async getCurrentUser() {
    return await this.supabase.auth.getUser();
  }
}