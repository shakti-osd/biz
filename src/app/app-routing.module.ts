import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { StoryListComponent } from "./stories/story-list/story-list.component";
import { StoryCreateComponent } from "./stories/story-create/story-create.component";
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { AuthGuard } from "./auth/auth.guard";

const routes: Routes = [
  { path: "", component: StoryListComponent },
  { path: "create", component: StoryCreateComponent, canActivate: [AuthGuard] },
  { path: "edit/:storyId", component: StoryCreateComponent, canActivate: [AuthGuard] },
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
