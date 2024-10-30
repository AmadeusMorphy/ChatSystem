import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './pages/chat/chat.component';
import { AuthComponent } from './pages/auth/auth.component';
import { HomeComponent } from './pages/home/home.component';
import { HeaderComponent } from './pages/widgets/header/header.component';
import { AddFriendComponent } from './pages/friends/add-friend/add-friend.component';
import { UserFriendsComponent } from './pages/friends/user-friends/user-friends.component';
import { FriendReqsComponent } from './pages/friends/friend-reqs/friend-reqs.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'header', component: HeaderComponent },
  {path: 'chat', component: ChatComponent},
  {path: 'auth', component: AuthComponent},
  {path: 'home', component: HomeComponent},
  {path: 'add-friend', component: AddFriendComponent},
  {path: 'friends', component: UserFriendsComponent},
  {path: 'friend-req', component: FriendReqsComponent},
  {path: 'user_profile', component: UserProfileComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
