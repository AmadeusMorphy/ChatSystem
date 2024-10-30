import { Component } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environment/environment';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {
  private supabase: SupabaseClient;
  imageUrl: string | null = null;

  constructor() {
    // Initialize the Supabase client with your URL and Anon Key
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  // Method to handle file selection and upload
  async onFileSelected(event: any): Promise<void> {
    const file: File = event.target.files[0];
    const uniqueId = uuidv4().slice(0, 6);
    const fileName = `${uniqueId}-${file.name}`;

    if (file) {
      const { data, error } = await this.supabase.storage
        .from('MRNZD_DB')
        .upload(`images/${uniqueId}`, file);

      if (error) {
        console.error('Error uploading file:', error);
        return;
      }

      // Fetch and display the uploaded image
      this.getImageUrl(file.name);
    }
  }

// Method to retrieve the public URL of an image
async getImageUrl(fileName: string): Promise<void> {
  const { data } = this.supabase.storage
    .from('MRNZD_DB')
    .getPublicUrl(`images/${fileName}`);

  // Check if data and publicUrl exist
  if (data && data.publicUrl) {
    this.imageUrl = data.publicUrl; 
    console.log("data: ", data);
    console.log("data public: ", data.publicUrl);
    // Assign the public URL to imageUrl
  } else {
    console.error('Error retrieving image URL');
  }
}

}
