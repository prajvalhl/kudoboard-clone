import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PostService } from '../service/post.service';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss'],
})
export class PostFormComponent {
  @Output() formClosed = new EventEmitter<void>();

  postForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private router: Router
  ) {
    this.postForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      message: ['', [Validators.required, Validators.maxLength(500)]],
    });
  }

  onSubmit(): void {
    if (this.postForm.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    const { name, message } = this.postForm.value;

    const newPost = this.postService.addPost(name, message);

    setTimeout(() => {
      this.isSubmitting = false;
      this.formClosed.emit();
      this.router.navigate(['/edit', newPost.id]);
    }, 500);
  }

  closeForm(): void {
    this.formClosed.emit();
  }
}
