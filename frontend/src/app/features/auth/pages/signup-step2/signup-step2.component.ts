import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup2',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup-step2.component.html',
  styles: ``,
})
export class Signup2Component {
  loading = false;
  error = '';

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      monthlyIncome: [0, [Validators.required, Validators.min(0)]],
      expenses: this.fb.group({
        housing: [0, [Validators.required, Validators.min(0)]],
        groceries: [0, [Validators.required, Validators.min(0)]],
        transportation: [0, [Validators.required, Validators.min(0)]],
        utilities: [0, [Validators.required, Validators.min(0)]],
        entertainment: [0, [Validators.required, Validators.min(0)]],
        healthcare: [0, [Validators.required, Validators.min(0)]],
        other: [0, [Validators.required, Validators.min(0)]],
      }),
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = '';

    const data = this.form.value as {
      monthlyIncome: number;
      expenses: {
        housing: number;
        groceries: number;
        transportation: number;
        utilities: number;
        entertainment: number;
        healthcare: number;
        other: number;
      }; 
    };

    this.auth.updateFinances(data).subscribe({
      next: (res) => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.errors?.[0]?.msg || 'Failed to save finances';
      },
    });
  }
}
