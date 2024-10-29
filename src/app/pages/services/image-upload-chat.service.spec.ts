import { TestBed } from '@angular/core/testing';

import { ImageUploadChatService } from './image-upload-chat.service';

describe('ImageUploadChatService', () => {
  let service: ImageUploadChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageUploadChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
