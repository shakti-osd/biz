import { Component, OnInit, OnDestroy } from "@angular/core";
import { PageEvent } from "@angular/material";
import { Subscription } from "rxjs";

import { Story } from "../story.model";
import { StoriesService } from "../stories.service";
import { AuthService } from "../../auth/auth.service";

@Component({
  selector: "app-story-list",
  templateUrl: "./story-list.component.html",
  styleUrls: ["./story-list.component.css"]
})
export class StoryListComponent implements OnInit, OnDestroy {

  stories: Story[] = [];
  isLoading = false;
  totalStories = 0;
  storiesPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  private storiesSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    public storiesService: StoriesService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.storiesService.getStories(this.storiesPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.storiesSub = this.storiesService
      .getStoryUpdateListener()
      .subscribe((storyData: { stories: Story[]; storyCount: number }) => {
        this.isLoading = false;
        this.totalStories = storyData.storyCount;
        this.stories = storyData.stories;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.storiesPerPage = pageData.pageSize;
    this.storiesService.getStories(this.storiesPerPage, this.currentPage);
  }

  onDelete(storyId: string) {
    this.isLoading = true;
    this.storiesService.deleteStory(storyId).subscribe(() => {
      this.storiesService.getStories(this.storiesPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.storiesSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
