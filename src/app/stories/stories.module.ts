import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { StoryCreateComponent } from "./story-create/story-create.component";
import { StoryListComponent } from "./story-list/story-list.component";
import { AngularMaterialModule } from "../angular-material.module";

@NgModule({
  declarations: [StoryCreateComponent, StoryListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule
  ]
})
export class StoriesModule {}
