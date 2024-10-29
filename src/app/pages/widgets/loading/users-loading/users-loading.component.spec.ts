import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersLoadingComponent } from './users-loading.component';

describe('UsersLoadingComponent', () => {
  let component: UsersLoadingComponent;
  let fixture: ComponentFixture<UsersLoadingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsersLoadingComponent]
    });
    fixture = TestBed.createComponent(UsersLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
