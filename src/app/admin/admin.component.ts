import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from '../models/post.model';
import { PostService } from '../service/post.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  posts: Post[] = [];
  selectedPost: Post | null = null;
  confirmDelete: string | null = null;
  searchTerm: string = '';
  sortBy: 'date' | 'name' = 'date';
  sortDirection: 'asc' | 'desc' = 'desc';

  constructor(private postService: PostService, private router: Router) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.postService.getPosts().subscribe((posts) => {
      this.posts = [...posts];
      this.sortPosts();
    });
  }

  sortPosts(): void {
    this.posts.sort((a, b) => {
      let comparison = 0;

      if (this.sortBy === 'date') {
        comparison =
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (this.sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      }

      return this.sortDirection === 'asc' ? comparison * -1 : comparison;
    });
  }

  toggleSort(sortField: 'date' | 'name'): void {
    if (this.sortBy === sortField) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = sortField;
      this.sortDirection = 'desc';
    }

    this.sortPosts();
  }

  get filteredPosts(): Post[] {
    if (!this.searchTerm.trim()) {
      return this.posts;
    }

    const term = this.searchTerm.toLowerCase().trim();
    return this.posts.filter(
      (post) =>
        post.name.toLowerCase().includes(term) ||
        post.message.toLowerCase().includes(term)
    );
  }

  editPost(id: string): void {
    this.router.navigate(['/edit', id]);
  }

  confirmDeletePost(id: string): void {
    this.confirmDelete = id;
  }

  cancelDelete(): void {
    this.confirmDelete = null;
  }

  deletePost(id: string): void {
    if (this.postService.deletePost(id)) {
      this.confirmDelete = null;
      this.loadPosts();
    }
  }

  goToHome(): void {
    this.router.navigate(['/home']);
  }

  getSortIcon(field: 'date' | 'name'): string {
    if (this.sortBy !== field) {
      return '↕️';
    }
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }
}
