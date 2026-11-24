import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHero } from '../shared/page-hero';
import { abs, routeFor } from '../shared/site';
import sitemap from '../data/sitemap.json';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-sitemap',
  imports: [RouterLink, PageHero],
  template: `
    <app-page-hero title="Site Map" subtitle="Every page and service on Digital Gujarat, grouped by topic." />
    <section class="section sm-page" data-main tabindex="-1">
      <div class="container">
        <div class="sm-cols">
          @for (g of groups; track g.title; let i = $index) {
            <section class="sm-group" [attr.aria-labelledby]="'sm-h-' + i">
              <h2 class="sm-title" [id]="'sm-h-' + i">{{ g.title }} <span class="sm-n">{{ g.links.length }}</span></h2>
              <ul class="sm-links" role="list">
                @for (l of g.links; track $index) {
                  <li>
                    @if (l.route) {
                      <a [routerLink]="l.route"><i class="pi pi-angle-right" aria-hidden="true"></i><span>{{ l.label }}</span></a>
                    } @else {
                      <a [href]="l.url" target="_blank" rel="noopener"><i class="pi pi-angle-right" aria-hidden="true"></i><span>{{ l.label }}<i class="pi pi-external-link ext" aria-hidden="true"></i><span class="sr-only"> (opens in a new tab)</span></span></a>
                    }
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
export class SitemapPage {
  groups = sitemap.map((g) => ({ title: g.title, links: g.links.map((l) => ({ label: l.label, route: routeFor(l.url), url: abs(l.url) })) }));
}
