import { Component, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { PageHero } from '../shared/page-hero';
import { HELPLINE, SUPPORT_EMAIL } from '../shared/site';
import policies from '../data/policies.json';

interface Block { t: 'h' | 'p' | 'li'; x: string; }
/** Render blocks: consecutive list items are grouped into one <ul>; headings get an id for "On this page". */
type View = { t: 'h'; x: string; id: string } | { t: 'p'; x: string } | { t: 'ul'; items: string[] };

const POLICIES = [
  { label: 'Terms & Conditions', route: '/terms-conditions', icon: 'pi pi-file' },
  { label: 'Privacy Policy', route: '/privacy-policy', icon: 'pi pi-lock' },
  { label: 'Copyright Policy', route: '/copyright-policy', icon: 'pi pi-copy' },
  { label: 'Disclaimer', route: '/disclaimer', icon: 'pi pi-exclamation-circle' },
  { label: 'Hyperlinking Policy', route: '/hyperlinking-policy', icon: 'pi pi-link' },
  { label: 'Accessibility Statement', route: '/accessibility-statement', icon: 'pi pi-eye' },
];

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-policy',
  imports: [RouterLink, RouterLinkActive, PageHero],
  template: `
    <app-page-hero [title]="title()" />
    <section class="section pol-page" data-main tabindex="-1">
      <div class="container pol-layout">
        <article class="pol-prose">
          @for (b of view(); track $index) {
            @switch (b.t) {
              @case ('h') { <h2 [id]="b.id" tabindex="-1">{{ b.x }}</h2> }
              @case ('ul') { <ul>@for (li of b.items; track $index) { <li>{{ li }}</li> }</ul> }
              @default { <p>{{ b.x }}</p> }
            }
          }
          <p class="pol-contact muted">
            Questions about this policy? Call <a [href]="'tel:' + helpline.tel">{{ helpline.label }}</a> (toll free) or write to <a [href]="'mailto:' + email">{{ email }}</a>.
          </p>
        </article>

        <aside class="pol-side">
          @if (toc().length > 1) {
            <nav class="card pol-nav" aria-labelledby="pol-toc">
              <h2 id="pol-toc" class="pol-nav-title">On this page</h2>
              <ul role="list">
                @for (h of toc(); track h.id) {
                  <li><a [href]="'#' + h.id" (click)="jump($event, h.id)">{{ h.x }}</a></li>
                }
              </ul>
            </nav>
          }
          <nav class="card pol-nav" aria-labelledby="pol-others">
            <h2 id="pol-others" class="pol-nav-title">Website policies</h2>
            <ul role="list">
              @for (p of policies; track p.route) {
                <li>
                  <a [routerLink]="p.route" routerLinkActive="active" ariaCurrentWhenActive="page">
                    <i [class]="p.icon" aria-hidden="true"></i><span>{{ p.label }}</span>
                  </a>
                </li>
              }
            </ul>
          </nav>
        </aside>
      </div>
    </section>
  `,
})
export class PolicyPage {
  private data = toSignal(inject(ActivatedRoute).data, { requireSync: true });
  readonly policies = POLICIES;
  readonly helpline = HELPLINE;
  readonly email = SUPPORT_EMAIL;
  title = computed<string>(() => this.data()['title']);
  blocks = computed<Block[]>(() => (policies as Record<string, Block[]>)[this.data()['key']] ?? []);
  view = computed<View[]>(() => {
    const out: View[] = [];
    this.blocks().forEach((b, i) => {
      if (b.t === 'li') {
        const last = out[out.length - 1];
        if (last?.t === 'ul') last.items.push(b.x); else out.push({ t: 'ul', items: [b.x] });
      } else if (b.t === 'h') out.push({ t: 'h', x: b.x, id: 'pol-s-' + i });
      else out.push({ t: 'p', x: b.x });
    });
    return out;
  });
  toc = computed(() => this.view().filter((b): b is Extract<View, { t: 'h' }> => b.t === 'h'));

  jump(e: Event, id: string) {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    el.focus({ preventScroll: true });
  }
}
