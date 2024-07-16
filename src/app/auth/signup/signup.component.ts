import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  EmailValidator,
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RecaptchaV3Module, ReCaptchaV3Service } from 'ng-recaptcha';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, RecaptchaV3Module],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  signupform: FormGroup;
  error: string[] = [];

  constructor(
    private FormBuilder: FormBuilder,
    private AuthService: AuthService,
    private route: Router,
    private recaptchaV3Service: ReCaptchaV3Service
  ) {
    this.signupform = this.FormBuilder.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      wallet: ['', Validators.required],
    });
  }
  register(username: string, email: string, password: string) {
    this.recaptchaV3Service.execute('importantAction').subscribe((token) => {
      this.AuthService.register(username, email, password, token).subscribe({
        next: (rep) => {
          this.route.navigate(['login/']);
        },
        error: (error) => {
          if (error.status === 400) {
            this.error = [];
            const errorKeys = Object.keys(error.error);
            for (const key of errorKeys) {
              if (error.error[key] && error.error[key][0]) {
                this.error.push(`${key} ${error.error[key][0]}`);
              }
            }
            const error_message = document.getElementById(
              'error'
            ) as HTMLElement;
            if (error_message) {
              error_message.style.display = 'block';
            }
          }
        },
      });
    });
  }
}
