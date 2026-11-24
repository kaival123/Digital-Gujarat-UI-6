import { Component, computed, effect, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonDirective } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Paginator, PaginatorState } from 'primeng/paginator';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { PageHero } from '../shared/page-hero';
import { IMG, SITE } from '../shared/site';
import citizen from '../data/citizen.json';
import sugam from '../data/sugam.json';
import dss from '../data/dss.json';
import janseva from '../data/janseva.json';

interface Item { title: string; img: string; }

function loadFavs(): Set<string> {
  try { return new Set<string>(JSON.parse(localStorage.getItem('dg-saved') ?? '[]')); } catch { return new Set(); }
}

const CONFIG: Record<string, { title: string; subtitle: string; page: string; items: Item[] }> = {
  citizen: { title: 'Citizen Services', subtitle: 'Certificates and passes available to every citizen of Gujarat.', page: 'Services/CitizenServices.aspx', items: citizen },
  sugam: { title: 'Sugam Digital Gujarat', subtitle: 'Online services — apply from home.', page: 'Services/SugamDGAbhiyanServices.aspx', items: sugam },
  dss: { title: 'Digital SevaSetu Services', subtitle: 'Department schemes and subsidies delivered through Digital SevaSetu.', page: 'Services/DSSServices.aspx', items: dss },
  janseva: { title: 'Janseva Services', subtitle: 'Services available through Janseva Kendras.', page: 'Services/JansevaServices.aspx', items: janseva },
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-service-list',
  imports: [FormsModule, RouterLink, ButtonDirective, IconField, InputIcon, InputText, Paginator, ToggleSwitch, PageHero],
  template: `
    <app-page-hero [title]="cfg().title" [subtitle]="cfg().subtitle" [trail]="trail" />
    <section class="section svc-page" data-main tabindex="-1">
      <div class="container svc-layout">
        <aside class="svc-side" aria-label="Find a service">
          <div class="card svc-filter" role="search">
            <div class="field">
              <label for="svc-q">Search services</label>
              <p-iconfield>
                <p-inputicon class="pi pi-search" />
                <input id="svc-q" pInputText type="search" enterkeyhint="search" autocomplete="off" [ngModel]="query()" (ngModelChange)="setQuery($event)" placeholder="e.g. income certificate" />
              </p-iconfield>
            </div>
            <p class="svc-count" aria-live="polite" aria-atomic="true">
              Showing <strong>{{ filtered().length }}</strong> of {{ cfg().items.length }} services
            </p>
            <div class="svc-saved">
              <label for="svc-saved"><i class="pi pi-heart-fill" aria-hidden="true"></i> Saved only <span class="muted">({{ savedHere() }})</span></label>
              <p-toggleswitch inputId="svc-saved" [ngModel]="savedOnly()" (ngModelChange)="setSaved($event)" />
            </div>
          </div>

          @if (key() === 'sugam') {
            <div class="card svc-help">
              <h2 class="svc-help-title">Need help applying?</h2>
              <p class="muted">Step-by-step PDF guides for every Sugam service.</p>
              <a pButton [outlined]="true" routerLink="/user-manual" class="btn-block"><i class="pi pi-book" aria-hidden="true"></i> User Manual</a>
            </div>
          }
          @if (key() === 'janseva') {
            <div class="card svc-help">
              <h2 class="svc-help-title">Visit a Janseva Kendra</h2>
              <p class="notice warn svc-time"><i class="pi pi-clock" aria-hidden="true"></i><span>Office time: 10 AM – 6 PM</span></p>
              <a pButton [outlined]="true" class="btn-block" [href]="site + 'Download/JanSevaKendraList.pdf'" target="_blank" rel="noopener">
                <i class="pi pi-download" aria-hidden="true"></i> Janseva Kendra list
                <span class="sr-only"> (PDF, opens in a new tab)</span>
              </a>
            </div>
          }
        </aside>

        <div class="svc-main">
          <h2 class="sr-only">Services</h2>
          @if (pageItems().length) {
            <ul class="svc-grid" role="list">
              @for (s of pageItems(); track s.title + $index) {
                <li class="svc-card">
                  <div class="svc-top">
                    <span class="svc-icon"><img [src]="img(s.img)" alt="" loading="lazy" width="40" height="40"></span>
                    <span class="svc-num" aria-hidden="true">{{ first() + $index + 1 }}</span>
                    <button type="button" class="svc-fav" [class.on]="isFav(s.title)" (click)="toggleFav(s.title)" [attr.aria-pressed]="isFav(s.title)" [attr.aria-label]="'Save: ' + s.title">
                      <i class="pi" [class.pi-heart-fill]="isFav(s.title)" [class.pi-heart]="!isFav(s.title)" aria-hidden="true"></i>
                    </button>
                  </div>
                  <h3>{{ s.title }}</h3>
                  <a class="more" [href]="site + cfg().page" target="_blank" rel="noopener">
                    Apply / Read more<span class="sr-only">: {{ s.title }}</span>
                    <i class="pi pi-external-link ext" aria-hidden="true"></i><span class="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              }
            </ul>
            <p-paginator [first]="first()" [rows]="rows" [totalRecords]="filtered().length" (onPageChange)="onPage($event)" [showCurrentPageReport]="true" currentPageReportTemplate="{first} – {last} of {totalRecords}" />
          } @else {
            <div class="empty">
              <i class="pi" [class.pi-heart]="savedOnly()" [class.pi-search]="!savedOnly()" aria-hidden="true"></i>
              <p>{{ savedOnly() ? 'No saved services here yet — select the heart on a service to save it.' : 'No services match “' + query() + '”.' }}</p>
              <button pButton type="button" [outlined]="true" size="small" (click)="reset()">Show all services</button>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class ServiceListPage {
  readonly site = SITE;
  readonly rows = 12;
  private route = inject(ActivatedRoute);
  private data = toSignal(this.route.data, { requireSync: true });
  key = computed<string>(() => this.data()['key']);
  cfg = computed(() => CONFIG[this.key()]);
  trail = [{ label: 'Services' }];
  query = signal('');
  first = signal(0);
  savedOnly = signal(false);
  favs = signal<Set<string>>(loadFavs());
  private qp = toSignal(this.route.queryParamMap);

  constructor() {
    effect(() => {
      const q = this.qp()?.get('q');
      if (q) { this.query.set(q); this.first.set(0); }
    });
  }

  /** Saved services that belong to this list (favourites are shared across all lists). */
  savedHere = computed(() => { const f = this.favs(); return this.cfg().items.filter((i) => f.has(i.title)).length; });

  filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const tokens = q.split(/\s+/).filter(Boolean);
    const favs = this.favs();
    let items = this.cfg().items;
    if (this.savedOnly()) items = items.filter((i) => favs.has(i.title));
    return tokens.length ? items.filter((i) => tokens.every((t) => i.title.toLowerCase().includes(t))) : items;
  });

  isFav(t: string) { return this.favs().has(t); }
  toggleFav(t: string) {
    const s = new Set(this.favs());
    if (s.has(t)) s.delete(t); else s.add(t);
    this.favs.set(s);
    try { localStorage.setItem('dg-saved', JSON.stringify([...s])); } catch { /* storage unavailable */ }
  }
  setSaved(v: boolean) { this.savedOnly.set(v); this.first.set(0); }
  pageItems = computed(() => this.filtered().slice(this.first(), this.first() + this.rows));

  setQuery(v: string) { this.query.set(v); this.first.set(0); }
  reset() { this.query.set(''); this.savedOnly.set(false); this.first.set(0); }
  onPage(e: PaginatorState) { this.first.set(e.first ?? 0); document.querySelector('[data-main]')?.scrollIntoView({ behavior: 'smooth' }); }
  img(p: string) { return IMG + encodeURI(p); }
}
