import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { JwtModule } from '@auth0/angular-jwt';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { FileUploadModule } from 'ng2-file-upload';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { AuthService } from './services/auth.service';
import { RegisterComponent } from './register/register.component';
import { ErrorInterceptorProvider } from './services/errorinterceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MemberListComponent } from './members/member-list/member-list.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { AuthGuard } from './guards/auth.guard';
import { MemberCardComponent } from './members/member-card/member-card.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { AlertifyService } from './services/alertify.service';
import { UserService } from './services/user.service';
import { MemberDetailResolver } from './resolvers/member-detail.resolver';
import { MemberListResolver } from './resolvers/member-list.resolver';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberEditResolver } from './resolvers/member-edit.resolver';
import { PreventUnsaveChanges } from './guards/prevent-unsaved-changes.guard';
import { PhotoEditorComponent } from './members/photo-editor/photo-editor.component';


export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    RegisterComponent,
    MemberListComponent,
    ListsComponent,
    MessagesComponent,
    MemberCardComponent,
    MemberDetailComponent,
    MemberEditComponent,
    PhotoEditorComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:44328'],
        blacklistedRoutes: ['localhost:44328/api/auth'],
      },
    }),
    FormsModule,
    ReactiveFormsModule,
    FileUploadModule,
    TabsModule.forRoot(),
    BsDropdownModule.forRoot(),
    NgxGalleryModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent },
      {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        children: [
          {
            path: 'members',
            component: MemberListComponent,
            resolve: { users: MemberListResolver },
          },
          {
            path: 'members/:id',
            component: MemberDetailComponent,
            resolve: { user: MemberDetailResolver },
          },
          {
            path: 'member/edit',
            component: MemberEditComponent,
            resolve: { user: MemberEditResolver },
            canDeactivate: [PreventUnsaveChanges]
          },
          { path: 'messages', component: MessagesComponent },
          { path: 'lists', component: ListsComponent },
        ],
      },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ]),
    BrowserAnimationsModule,
  ],
  providers: [
    AuthService,
    ErrorInterceptorProvider,
    AlertifyService,
    AuthGuard,
    UserService,
    MemberDetailResolver,
    MemberListResolver,
    MemberEditResolver,
    PreventUnsaveChanges
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
