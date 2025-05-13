import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  // In a real app, this would connect to a backend
  private posts: Post[] = [];
  private postsSubject = new BehaviorSubject<Post[]>([]);

  // Array of background colors for posts
  private colors = [
    '#FFD6E0',
    '#FFEFCF',
    '#D4F0F0',
    '#CCE2CB',
    '#B6CFB6',
    '#D8BFD8',
    '#FFB997',
    '#B5EAD7',
  ];

  constructor() {
    // Load from localStorage if available
    const savedPosts = localStorage.getItem('kudoPosts');
    if (savedPosts) {
      this.posts = JSON.parse(savedPosts);
      this.postsSubject.next([...this.posts]);
    }
  }

  getPosts(): Observable<Post[]> {
    return this.postsSubject.asObservable();
  }

  getPost(id: string): Post | undefined {
    return this.posts.find((post) => post.id === id);
  }

  addPost(name: string, message: string): Post {
    const id = this.generateId();
    const randomColor =
      this.colors[Math.floor(Math.random() * this.colors.length)];

    const newPost: Post = {
      id,
      name,
      message,
      color: randomColor,
      createdAt: new Date(),
    };

    this.posts.push(newPost);
    this.postsSubject.next([...this.posts]);
    this.savePosts();

    return newPost;
  }

  updatePost(id: string, name: string, message: string): Post | null {
    const postIndex = this.posts.findIndex((post) => post.id === id);

    if (postIndex === -1) {
      return null;
    }

    this.posts[postIndex] = {
      ...this.posts[postIndex],
      name,
      message,
    };

    this.postsSubject.next([...this.posts]);
    this.savePosts();

    return this.posts[postIndex];
  }

  deletePost(id: string): boolean {
    const initialLength = this.posts.length;
    this.posts = this.posts.filter((post) => post.id !== id);

    if (this.posts.length !== initialLength) {
      this.postsSubject.next([...this.posts]);
      this.savePosts();
      return true;
    }

    return false;
  }

  private generateId(): string {
    // Simple ID generator - in a real app, use a more robust solution
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  private savePosts(): void {
    localStorage.setItem('kudoPosts', JSON.stringify(this.posts));
  }
}
