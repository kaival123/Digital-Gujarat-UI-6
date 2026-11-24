import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonDirective } from 'primeng/button';
import { PageHero } from '../shared/page-hero';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-not-found',
  imports: [RouterLink, ButtonDirective, PageHero],
  template: `
    <app-page-hero title="Page not found" subtitle="Error 404" />
    <section class="section nf-page" data-main tabindex="-1">
      <div class="container nf-wrap">
        <div class="nf-code" aria-hidden="true"><i class="pi pi-compass"></i><span>404</span></div>
        <h2>We couldn’t find that page</h2>
        <p class="muted">The page you are looking for does not exist, has moved, or the address was typed incorrectly. These links may help:</p>
        <a pButton routerLink="/" class="nf-home"><i class="pi pi-home" aria-hidden="true"></i> Back to home</a>
        <ul class="nf-links" role="list">
          @for (l of links; track l.route) {
            <li>
              <a class="card card-link nf-link" [routerLink]="l.route">
                <span class="icon-tile" aria-hidden="true"><i [class]="l.icon"></i></span>
                <span class="nf-tx"><b>{{ l.label }}</b><small>{{ l.hint }}</small></span>
                <i class="pi pi-arrow-right nf-arrow" aria-hidden="true"></i>
              </a>
            </li>
          }
        </ul>
      </div>
    </section>
  `,
})
export class NotFoundPage {
  links = [
    { label: 'Services', hint: 'Citizen services and certificates', route: '/services/citizen', icon: 'pi pi-th-large' },
    { label: 'Site Map', hint: 'Every page in one place', route: '/sitemap', icon: 'pi pi-sitemap' },
    { label: 'Help Desk', hint: 'Call or email support', route: '/help-desk', icon: 'pi pi-headphones' },
  ];
}
