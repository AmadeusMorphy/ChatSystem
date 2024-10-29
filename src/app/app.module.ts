import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatComponent } from './pages/chat/chat.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ButtonModule } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext';
import { HomeComponent } from './pages/home/home.component';
import { AuthComponent } from './pages/auth/auth.component';
import { LoadingComponent } from './pages/widgets/loading/loading.component';
import { HeaderComponent } from './pages/widgets/header/header.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AddFriendComponent } from './pages/friends/add-friend/add-friend.component';
import { UserFriendsComponent } from './pages/friends/user-friends/user-friends.component';
import { FriendReqsComponent } from './pages/friends/friend-reqs/friend-reqs.component';
import { SkeletonModule } from 'primeng/skeleton';
import {NgxImageCompressService} from 'ngx-image-compress';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { UsersLoadingComponent } from './pages/widgets/loading/users-loading/users-loading.component';
import { FileUploadModule } from 'primeng/fileupload';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    HomeComponent,
    AuthComponent,
    LoadingComponent,
    HeaderComponent,
    AddFriendComponent,
    UserFriendsComponent,
    FriendReqsComponent,
    UsersLoadingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterOutlet,
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    ToastModule,
    ConfirmDialogModule,
    SkeletonModule,
    LazyLoadImageModule,
    FileUploadModule
  ],
  providers: [ConfirmationService, MessageService, NgxImageCompressService],
  bootstrap: [AppComponent]
})
export class AppModule { }
