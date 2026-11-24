import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonDirective } from 'primeng/button';
import { PageHero } from '../shared/page-hero';
import { SITE } from '../shared/site';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-feedback-dashboard',
  imports: [RouterLink, ButtonDirective, PageHero],
  template: `
    <app-page-hero title="Citizen Feedback Dashboard" subtitle="Feedback analytics & service satisfaction overview" />
    <section class="section fd-page" data-main tabindex="-1">
      <div class="container">
        <div class="notice fd-notice">
          <i class="pi pi-info-circle" aria-hidden="true"></i>
          <p>Live ratings come from the Digital Gujarat feedback database and are not bundled with this demo.</p>
        </div>

        <div class="fd-grid">
          <div class="card fd-card fd-overall">
            <div class="fd-head">
              <span class="icon-tile" aria-hidden="true"><i class="pi pi-chart-pie"></i></span>
              <h2>Overall Satisfaction</h2>
            </div>
            <p class="muted">Average of all five feedback questions.</p>
            <div class="fd-gauge">
              <span class="fd-value">—</span>
              <span class="muted">Shown on the live dashboard</span>
            </div>
          </div>

          <div class="card fd-card fd-rank">
            <div class="fd-head">
              <span class="icon-tile accent" aria-hidden="true"><i class="pi pi-star"></i></span>
              <h2>Question Rating Ranking</h2>
            </div>
            <p class="muted">Each feedback question is rated on a five-point scale.</p>
            <ol class="fd-list" role="list">
              @for (q of questions; track q.label; let i = $index) {
                <li>
                  <span class="fd-n" aria-hidden="true">{{ i + 1 }}</span>
                  <i [class]="q.icon" aria-hidden="true"></i>
                  <span>{{ q.label }}</span>
                </li>
              }
            </ol>
          </div>

          <div class="card fd-card fd-cta">
            <span class="icon-tile green" aria-hidden="true"><i class="pi pi-comment"></i></span>
            <h2>Your opinion counts</h2>
            <p class="muted">Rate a service you used and tell us what to improve. It takes about two minutes.</p>
            <div class="btn-row">
              <a pButton routerLink="/feedback"><i class="pi pi-comment" aria-hidden="true"></i> Share your feedback</a>
              <a pButton [outlined]="true" [href]="site + 'LinkPages/FeedbackDashboard.aspx'" target="_blank" rel="noopener">Open live dashboard <i class="pi pi-external-link ext" aria-hidden="true"></i><span class="sr-only"> (opens in a new tab)</span></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class FeedbackDashboardPage {
  site = SITE;
  questions = [
    { label: 'Service Access', icon: 'pi pi-sign-in' },
    { label: 'Instructions', icon: 'pi pi-list' },
    { label: 'Timeliness', icon: 'pi pi-clock' },
    { label: 'User Interface', icon: 'pi pi-desktop' },
    { label: 'Overall Experience', icon: 'pi pi-thumbs-up' },
  ];
}
