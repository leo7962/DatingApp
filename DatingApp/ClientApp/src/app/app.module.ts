import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { TabsModule } from "ngx-bootstrap/tabs";
import { JwtModule } from "@auth0/angular-jwt";

import { AppComponent } from "./app.component";
import { NavMenuComponent } from "./nav-menu/nav-menu.component";
import { HomeComponent } from "./home/home.component";
import { AuthService } from "./services/auth.service";
import { RegisterComponent } from "./register/register.component";
import { ErrorInterceptorProvider } from "./services/errorinterceptor";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MemberListComponent } from "./members/member-list/member-list.component";
import { ListsComponent } from "./lists/lists.component";
import { MessagesComponent } from "./messages/messages.component";
import { AuthGuard } from "./guards/auth.guard";
import { MemberCardComponent } from "./members/member-card/member-card.component";
import { MemberDetailComponent } from "./members/member-detail/member-detail.component";


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
    MemberDetailComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: "ng-cli-universal" }),
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:44328'],
        blacklistedRoutes: ['localhost:44328/api/auth']
      }
    }),
    FormsModule,
    TabsModule.forRoot(),
    BsDropdownModule.forRoot(),
    RouterModule.forRoot([
      { path: "", component: HomeComponent },
      {
        path: "",
        runGuardsAndResolvers: "always",
        canActivate: [AuthGuard],
        children: [
          { path: "members", component: MemberListComponent },
          { path: "members/:id", component: MemberDetailComponent },
          { path: "messages", component: MessagesComponent },
          { path: "lists", component: ListsComponent },
        ]
      },
      { path: "**", redirectTo: "", pathMatch: "full" },
    ]),
    BrowserAnimationsModule,
  ],
  providers: [AuthService, ErrorInterceptorProvider],
  bootstrap: [AppComponent],
})
export class AppModule {}
