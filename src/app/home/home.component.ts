import { Component, OnInit } from '@angular/core';
import { Post } from '../models/post.model';
import { PostService } from '../service/post.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  posts: Post[] = [];
  showForm = false;

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.postService.getPosts().subscribe((posts) => {
      this.posts = posts.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
  }
}
