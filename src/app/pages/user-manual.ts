import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHero } from '../shared/page-hero';
import { abs } from '../shared/site';
import manuals from '../data/manuals.json';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-user-manual',
  imports: [RouterLink, PageHero],
  template: `
    <app-page-hero title="Sugam User Manual" subtitle="Download step-by-step guides for every Sugam service." [trail]="[{ label: 'Sugam Digital Gujarat', routerLink: '/sugam-digital-gujarat' }]" />
    <section class="section um-page" data-main tabindex="-1">
      <div class="container um-layout">
        <aside class="um-side" aria-label="Manual groups">
          <div class="card um-side-card">
            <p class="um-side-label">Jump to</p>
            <ul role="list">
              @for (g of groups; track g.title; let i = $index) {
                <li><a [href]="'#um-g-' + i" (click)="jump($event, 'um-g-' + i)">{{ g.title }} <span class="badge">{{ g.links.length }}</span></a></li>
              }
            </ul>
            <p class="um-note"><i class="pi pi-info-circle" aria-hidden="true"></i> Files open as PDF in a new tab. You need a PDF reader to view them.</p>
            <a class="more" routerLink="/sugam-digital-gujarat">Browse Sugam services <i class="pi pi-arrow-right" aria-hidden="true"></i></a>
          </div>
        </aside>

        <div class="um-main">
          @for (g of groups; track g.title; let gi = $index) {
            <section class="um-group" [attr.aria-labelledby]="'um-g-' + gi">
              <h2 class="um-title" [id]="'um-g-' + gi" tabindex="-1">{{ g.title }}</h2>
              <ul class="um-list" role="list">
                @for (l of g.links; track l.url) {
                  <li class="um-row">
                    <span class="um-ic" aria-hidden="true"><i class="pi pi-file-pdf"></i></span>
                    <span class="um-name">{{ l.label }}</span>
                    <span class="badge accent um-badge" aria-hidden="true">PDF</span>
                    <a class="um-dl" [href]="l.url" target="_blank" rel="noopener">
                      <i class="pi pi-download" aria-hidden="true"></i><span class="um-dl-tx">Download</span>
                      <span class="sr-only"> {{ l.label }} (PDF, opens in a new tab)</span>
                    </a>
                  </li>
                }
              </ul>
            </section>
          }
        </div>
      </div>
    </section>
  `,
})
export class UserManualPage {
  groups = manuals.map((g) => ({ title: g.title, links: g.links.map((l) => ({ label: l.label, url: abs(l.url) })) }));
  jump(e: Event, id: string) {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    el.focus({ preventScroll: true });
  }
}
