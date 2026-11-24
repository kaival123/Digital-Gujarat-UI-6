import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonDirective } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { SelectButton } from 'primeng/selectbutton';
import { Textarea } from 'primeng/textarea';
import { PageHero } from '../shared/page-hero';

const Q = (q: string, options: string[]) => ({ q, options, value: null as string | null });

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-feedback',
  imports: [FormsModule, RouterLink, ButtonDirective, InputText, SelectButton, Textarea, PageHero],
  template: `
    <app-page-hero title="Feedback" subtitle="Tell us how we can make Digital Gujarat better." />
    <section class="section fb-page" data-main tabindex="-1">
      <div class="container narrow">
        @if (sent()) {
          <div class="notice success fb-done" id="fb-done" role="status" tabindex="-1">
            <i class="pi pi-check-circle" aria-hidden="true"></i>
            <div>
              <h2 class="fb-done-title">Thank you for your feedback</h2>
              <p>Your response has been recorded in this demo.</p>
              <div class="btn-row">
                <button pButton type="button" (click)="again()"><i class="pi pi-refresh" aria-hidden="true"></i> Send another response</button>
                <a pButton [outlined]="true" routerLink="/feedback-dashboard">View feedback dashboard</a>
              </div>
            </div>
          </div>
        } @else {
          <form class="card fb-form" (ngSubmit)="submit(f)" #f="ngForm" novalidate aria-describedby="fb-req-note">
            <p class="fb-req-note muted" id="fb-req-note">Fields marked <span class="req" aria-hidden="true">*</span><span class="sr-only">with an asterisk</span> are required.</p>

            @if (f.submitted && f.invalid) {
              <div class="notice warn fb-errors" role="alert">
                <i class="pi pi-exclamation-triangle" aria-hidden="true"></i>
                <p>Please correct the highlighted fields below.</p>
              </div>
            }

            <fieldset class="fb-set">
              <legend>Your details</legend>
              <div class="fb-grid">
                <div class="field">
                  <label for="fb-name">Full name <span class="req" aria-hidden="true">*</span></label>
                  <input pInputText id="fb-name" name="name" autocomplete="name" [(ngModel)]="form.name" #name="ngModel" required
                    [attr.aria-invalid]="show(name, f) ? true : null" [attr.aria-describedby]="show(name, f) ? 'fb-name-err' : null">
                  @if (show(name, f)) { <span class="error" id="fb-name-err"><i class="pi pi-times-circle" aria-hidden="true"></i> Enter your name.</span> }
                </div>
                <div class="field">
                  <label for="fb-email">Email <span class="req" aria-hidden="true">*</span></label>
                  <input pInputText id="fb-email" type="email" name="email" autocomplete="email" [(ngModel)]="form.email" #email="ngModel" required email
                    [attr.aria-invalid]="show(email, f) ? true : null" [attr.aria-describedby]="show(email, f) ? 'fb-email-err' : null">
                  @if (show(email, f)) { <span class="error" id="fb-email-err"><i class="pi pi-times-circle" aria-hidden="true"></i> {{ email.errors?.['required'] ? 'Enter your email address.' : 'Enter a valid email address, e.g. name@example.com.' }}</span> }
                </div>
                <div class="field">
                  <label for="fb-mobile">Mobile number <span class="req" aria-hidden="true">*</span></label>
                  <input pInputText id="fb-mobile" type="tel" inputmode="numeric" name="mobile" autocomplete="tel-national" [(ngModel)]="form.mobile" #mobile="ngModel" pattern="[0-9]{10}" maxlength="10" required
                    [attr.aria-describedby]="show(mobile, f) ? 'fb-mobile-hint fb-mobile-err' : 'fb-mobile-hint'" [attr.aria-invalid]="show(mobile, f) ? true : null">
                  <span class="hint" id="fb-mobile-hint">10 digits, without +91 or 0.</span>
                  @if (show(mobile, f)) { <span class="error" id="fb-mobile-err"><i class="pi pi-times-circle" aria-hidden="true"></i> {{ mobile.errors?.['required'] ? 'Enter your mobile number.' : 'Mobile number must be exactly 10 digits.' }}</span> }
                </div>
                <div class="field">
                  <label for="fb-subject">Subject <span class="muted fb-opt">(optional)</span></label>
                  <input pInputText id="fb-subject" name="subject" [(ngModel)]="form.subject">
                </div>
              </div>
            </fieldset>

            <fieldset class="fb-set">
              <legend>Rate your experience <span class="muted fb-opt">(optional)</span></legend>
              <ol class="fb-questions" role="list">
                @for (q of questions; track q.q; let i = $index) {
                  <li>
                    <fieldset class="fb-q">
                      <legend><span class="fb-qn" aria-hidden="true">{{ i + 1 }}</span>{{ q.q }}</legend>
                      <p-selectbutton [options]="q.options" [(ngModel)]="q.value" [name]="'q' + i" [allowEmpty]="false" size="small" [ariaLabel]="q.q" />
                    </fieldset>
                  </li>
                }
              </ol>
            </fieldset>

            <div class="field">
              <label for="fb-message">Message <span class="muted fb-opt">(optional)</span></label>
              <textarea pTextarea id="fb-message" name="message" rows="5" maxlength="1000" [(ngModel)]="form.message" aria-describedby="fb-msg-hint"></textarea>
              <span class="hint" id="fb-msg-hint">{{ (form.message || '').length }} / 1000 characters</span>
            </div>

            <div class="fb-actions">
              <button pButton type="submit"><i class="pi pi-send" aria-hidden="true"></i> Submit feedback</button>
              <button pButton type="button" variant="text" (click)="reset(f)">Clear form</button>
            </div>
          </form>
        }
      </div>
    </section>
  `,
})
export class FeedbackPage {
  sent = signal(false);
  form = { name: '', email: '', mobile: '', subject: '', message: '' };
  questions = [
    Q('How easy was it to access the service online?', ['Very Difficult', 'Difficult', 'Neutral', 'Easy', 'Very Easy']),
    Q('How clear and understandable were the instructions for completing the process?', ['Very Unclear', 'Unclear', 'Neutral', 'Clear', 'Very Clear']),
    Q('How satisfied are you with the timeliness of the service?', ['Very Slow', 'Slow', 'Average', 'Fast', 'Very Fast']),
    Q('How satisfied are you with the user interface?', ['Very Poor', 'Poor', 'Average', 'Good', 'Excellent']),
    Q('Overall, how satisfied are you with the overall online service experience?', ['Very Unsatisfied', 'Unsatisfied', 'Neutral', 'Satisfied', 'Very Satisfied']),
  ];

  /** Show a field's error once the user has left it or tried to submit. */
  show(c: { invalid: boolean | null; touched: boolean | null }, f: NgForm) { return !!c.invalid && (!!c.touched || f.submitted); }

  submit(f: NgForm) {
    if (f.invalid) {
      // move focus to the first field that needs fixing (WCAG 3.3.1)
      setTimeout(() => (document.querySelector('.fb-form .ng-invalid:not(form)') as HTMLElement | null)?.focus());
      return;
    }
    this.sent.set(true);
    setTimeout(() => document.getElementById('fb-done')?.focus());
  }
  reset(f: NgForm) {
    f.resetForm();
    this.form = { name: '', email: '', mobile: '', subject: '', message: '' };
    this.questions.forEach((q) => (q.value = null));
  }
  again() {
    this.form = { name: '', email: '', mobile: '', subject: '', message: '' };
    this.questions.forEach((q) => (q.value = null));
    this.sent.set(false);
  }
}
