import { Component, computed, effect, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { PageHero } from '../shared/page-hero';
import linked from '../data/linked.json';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-linked-services',
  imports: [FormsModule, ButtonDirective, IconField, InputIcon, InputText, Select, TableModule, PageHero],
  template: `
    <app-page-hero title="Linked Services" subtitle="Online services of other departments and municipal corporations." [trail]="[{ label: 'Services' }]" />
    <section class="section ls-page" data-main tabindex="-1">
      <div class="container">
        <div class="card ls-filters" role="search" aria-label="Filter linked services">
          <div class="field ls-dept">
            <label for="ls-dept">Department</label>
            <p-select inputId="ls-dept" [options]="departments" [ngModel]="dept()" (ngModelChange)="dept.set($event)" [showClear]="true" placeholder="All departments" [filter]="true" filterPlaceholder="Type to filter" appendTo="body" />
          </div>
          <div class="field ls-search">
            <label for="ls-q">Search by name or description</label>
            <p-iconfield>
              <p-inputicon class="pi pi-search" />
              <input id="ls-q" pInputText type="search" enterkeyhint="search" autocomplete="off" [ngModel]="query()" (ngModelChange)="query.set($event)" placeholder="e.g. complaint, property tax" />
            </p-iconfield>
          </div>
          <div class="ls-meta">
            <p class="ls-count" aria-live="polite" aria-atomic="true"><strong>{{ rows().length }}</strong> {{ rows().length === 1 ? 'service' : 'services' }} found</p>
            @if (dept() || query()) {
              <button pButton type="button" variant="text" size="small" (click)="clear()"><i class="pi pi-filter-slash" aria-hidden="true"></i> Clear filters</button>
            }
          </div>
        </div>

        <p-table [value]="rows()" [paginator]="true" [rows]="10" [rowsPerPageOptions]="[10, 25, 50]" [stripedRows]="true" [scrollable]="true" [tableStyle]="{ 'min-width': '52rem' }" styleClass="ls-table">
          <ng-template #header>
            <tr><th scope="col" style="width:4rem">No.</th><th scope="col">Service name</th><th scope="col">Description</th><th scope="col" style="width:13rem">Department</th><th scope="col" style="width:8rem">Service</th></tr>
          </ng-template>
          <ng-template #body let-r let-i="rowIndex">
            <tr>
              <td class="muted">{{ i + 1 }}</td>
              <td class="strong">{{ r.name }}</td>
              <td class="ls-desc">{{ r.desc }}</td>
              <td>@if (r.dept) { <span class="badge">{{ r.dept }}</span> } @else { <span class="muted">—</span> }</td>
              <td>
                <a pButton size="small" [outlined]="true" [href]="r.url" target="_blank" rel="noopener">
                  Open<span class="sr-only"> {{ r.name }}</span>
                  <i class="pi pi-external-link ext" aria-hidden="true"></i><span class="sr-only"> (opens in a new tab)</span>
                </a>
              </td>
            </tr>
          </ng-template>
          <ng-template #emptymessage>
            <tr><td colspan="5"><div class="empty"><i class="pi pi-search" aria-hidden="true"></i><p>No services match your filters.</p></div></td></tr>
          </ng-template>
        </p-table>
      </div>
    </section>
  `,
})
export class LinkedServicesPage {
  departments: string[] = linked.departments.filter(Boolean);
  dept = signal<string | null>(null);
  query = signal('');
  private qp = toSignal(inject(ActivatedRoute).queryParamMap);
  constructor() { effect(() => { const q = this.qp()?.get('q'); if (q) this.query.set(q); }); }
  rows = computed(() => {
    const d = this.dept();
    const q = this.query().trim().toLowerCase();
    return linked.rows.filter((r) => (!d || r.dept === d) && (!q || (r.name + ' ' + r.desc).toLowerCase().includes(q)));
  });
  clear() { this.dept.set(null); this.query.set(''); }
}
