import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { Story } from "./story.model";

@Injectable({ providedIn: "root" })
export class StoriesService {
  private stories: Story[] = [];
  private storiesUpdated = new Subject<{ stories: Story[]; storyCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getStories(storiesPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${storiesPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; stories: any; maxStories: number }>(
        "http://localhost:3000/api/stories" + queryParams
      )
      .pipe(
        map(storyData => {
          return {
            stories: storyData.stories.map(story => {
              return {
                title: story.title,
                content: story.content,
                id: story._id,
                imagePath: story.imagePath,
                creator: story.creator
              };
            }),
            maxStories: storyData.maxStories
          };
        })
      )
      .subscribe(transformedStoryData => {
        this.stories = transformedStoryData.stories;
        this.storiesUpdated.next({
          stories: [...this.stories],
          storyCount: transformedStoryData.maxStories
        });
      });
  }

  getStoryUpdateListener() {
    return this.storiesUpdated.asObservable();
  }

  getStory(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator: string;
    }>("http://localhost:3000/api/stories/" + id);
  }

  addStory(title: string, content: string, image: File) {
    const storyData = new FormData();
    storyData.append("title", title);
    storyData.append("content", content);
    storyData.append("image", image, title);
    this.http
      .post<{ message: string; story: Story }>(
        "http://localhost:3000/api/stories",
        storyData
      )
      .subscribe(responseData => {
        this.router.navigate(["/"]);
      });
  }

  updateStory(id: string, title: string, content: string, image: File | string) {
    let storyData: Story | FormData;
    if (typeof image === "object") {
      storyData = new FormData();
      storyData.append("id", id);
      storyData.append("title", title);
      storyData.append("content", content);
      storyData.append("image", image, title);
    } else {
      storyData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      };
    }
    this.http
      .put("http://localhost:3000/api/stories/" + id, storyData)
      .subscribe(response => {
        this.router.navigate(["/"]);
      });
  }

  deleteStory(storyId: string) {
    return this.http.delete("http://localhost:3000/api/stories/" + storyId);
  }
}
