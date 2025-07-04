import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  RecaptchaModule,
  RecaptchaFormsModule
} from 'ng-recaptcha';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    TranslateModule
  ],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  contactForm: FormGroup;
  submitAttempted = false;
  loading = false;
  result: boolean | null = null;

  constructor(private formBuilder: FormBuilder) {
    this.contactForm = this.formBuilder.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      mail: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.pattern(/^[0-9+\s-]+$/)]],
      message: ['', [Validators.required, Validators.minLength(10)]],
      recaptcha: ['', Validators.required]
    });

    this.contactForm.valueChanges.subscribe(() => {
      if (this.result !== null) {
        this.result = null;
        this.submitAttempted = false;
      }
    });
  }

  onCaptchaResolved(token: string | null): void {
    this.contactForm.get('recaptcha')!.setValue(token || '');
  }

  handleSubmit(): void {
    this.submitAttempted = true;
    this.contactForm.markAllAsTouched();

    if (this.contactForm.invalid) {
      this.result = false;
      return;
    }

    this.loading = true;
    this.result = null;

    setTimeout(() => {
      this.loading = false;
      this.result = true;
      console.log('Formulaire envoyé :', this.contactForm.value);
    }, 2000);
  }
}