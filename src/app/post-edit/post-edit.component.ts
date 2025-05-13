import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../service/post.service';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.scss'],
})
export class PostEditComponent implements OnInit {
  postForm: FormGroup;
  postId: string = '';
  isSubmitting = false;
  success = false;
  notFound = false;
  editUrl = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService
  ) {
    this.postForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      message: ['', [Validators.required, Validators.maxLength(500)]],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.postId = params['id'];
      const post = this.postService.getPost(this.postId);

      if (post) {
        this.postForm.patchValue({
          name: post.name,
          message: post.message,
        });
        this.editUrl = window.location.href;
      } else {
        this.notFound = true;
      }
    });
  }

  onSubmit(): void {
    if (this.postForm.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    const { name, message } = this.postForm.value;

    const updatedPost = this.postService.updatePost(this.postId, name, message);

    if (updatedPost) {
      this.success = true;
      setTimeout(() => {
        this.success = false;
        this.isSubmitting = false;
      }, 3000);
    } else {
      this.notFound = true;
      this.isSubmitting = false;
    }
  }

  copyEditLink(): void {
    navigator.clipboard
      .writeText(this.editUrl)
      .then(() => {
        alert('Edit link copied to clipboard!');
      })
      .catch((err) => {
        console.error('Could not copy text: ', err);
      });
  }

  goToHome(): void {
    this.router.navigate(['/home']);
  }
}
