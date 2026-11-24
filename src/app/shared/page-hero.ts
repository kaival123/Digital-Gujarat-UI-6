import { Component, computed, input, ChangeDetectionStrategy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { LAST_UPDATED } from './site';

/** Inner-page banner: breadcrumb (GIGW: location indicator on every inner page), title, intro, plus a meta strip with the last-updated date and print. */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-page-hero',
  imports: [Breadcrumb],
  template: `
    <section class="page-hero">
      <div class="container">
        <nav aria-label="Breadcrumb"><p-breadcrumb [model]="items()" [home]="home" /></nav>
        <h1>{{ title() }}</h1>
        @if (subtitle()) { <p>{{ subtitle() }}</p> }
      </div>
    </section>
    <div class="page-meta">
      <div class="container page-meta-inner">
        <span><i class="pi pi-calendar" aria-hidden="true"></i> Last updated: <time>{{ updated }}</time></span>
        <span class="pm-actions">
          <button type="button" (click)="print()"><i class="pi pi-print" aria-hidden="true"></i> Print</button>
        </span>
      </div>
    </div>
  `,
  styles: [`:host { display: block; } .page-meta-inner { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px; } .page-meta-inner i { margin-right: 4px; }`],
})
export class PageHero {
  title = input.required<string>();
  subtitle = input('');
  /** Breadcrumb trail below Home, e.g. [{ label: 'Services' }, { label: 'Citizen' }]. */
  trail = input<MenuItem[]>([]);
  home: MenuItem = { icon: 'pi pi-home', routerLink: '/', label: '', ariaLabel: 'Home' } as MenuItem;
  items = computed<MenuItem[]>(() => [...this.trail(), { label: this.title() }]);
  readonly updated = LAST_UPDATED;
  print() { window.print(); }
}
