import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, RouterModule } from '@angular/router';
@Component({
  selector: 'app-loggin',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './loggin.component.html',
  styleUrl: './loggin.component.css',
})
export class LogginComponent {
  error = '';
  loginform: FormGroup;
  constructor(
    private FormBuilder: FormBuilder,
    private AuthService: AuthService,
    private router: Router
  ) {
    this.loginform = this.FormBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  login(username: string, password: string) {
    const submit_button = document.getElementById('submit-button') as HTMLElement;
    submit_button.style.backgroundColor = 'grey';
    this.AuthService.login(username, password).subscribe({
      next: (result: any) => {
        this.AuthService.setToken(result.access, result.refresh);
        this.AuthService.navigateTopreviousUrl();
      },
      error: (error) => {
        if (error.status == '401') {
          const error_message = document.getElementById('error') as HTMLElement;
          error_message.style.display = 'block';

          this.error = 'username or password is incorrect';

          submit_button.style.backgroundColor = '#4b70e2';
        } else this.error = 'error';
      },
    });
  }
}
