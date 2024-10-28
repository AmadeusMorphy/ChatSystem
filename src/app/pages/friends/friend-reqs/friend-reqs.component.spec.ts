import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendReqsComponent } from './friend-reqs.component';

describe('FriendReqsComponent', () => {
  let component: FriendReqsComponent;
  let fixture: ComponentFixture<FriendReqsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FriendReqsComponent]
    });
    fixture = TestBed.createComponent(FriendReqsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
