import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import { TableModule } from 'primeng/table';
import { PageHero } from '../shared/page-hero';
import { abs } from '../shared/site';
import circulars from '../data/circulars.json';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const LONG_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** "17/08/2026" → parts for the calendar chip plus an ISO value for <time>. */
function parseDate(d: string) {
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(d);
  if (!m) return null;
  const mi = +m[2] - 1;
  return { day: m[1].padStart(2, '0'), mon: MONTHS[mi], year: m[3], iso: `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`, long: `${+m[1]} ${LONG_MONTHS[mi]} ${m[3]}` };
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-latest-update',
  imports: [ButtonDirective, Tabs, TabList, Tab, TabPanels, TabPanel, TableModule, PageHero],
  template: `
    <app-page-hero title="Latest Update" subtitle="News, circulars and notifications from Digital Gujarat." />
    <section class="section lu-page" data-main tabindex="-1">
      <div class="container">
        <p-tabs value="news">
          <p-tablist>
            <p-tab value="news"><i class="pi pi-megaphone" aria-hidden="true"></i> News &amp; Updates <span class="count">{{ news.length }}</span></p-tab>
            <p-tab value="circular"><i class="pi pi-file" aria-hidden="true"></i> Circular / Notification <span class="count">{{ rows.length }}</span></p-tab>
          </p-tablist>
          <p-tabpanels>
            <p-tabpanel value="news">
              <h2 class="sr-only">News and updates</h2>
              <ul class="lu-news" role="list">
                @for (n of news; track $index) {
                  <li class="lu-item">
                    @if (n.d; as d) {
                      <time class="lu-date" [attr.datetime]="d.iso">
                        <span class="sr-only">{{ d.long }}</span>
                        <span class="lu-mon" aria-hidden="true">{{ d.mon }}</span>
                        <span class="lu-day" aria-hidden="true">{{ d.day }}</span>
                        <span class="lu-year" aria-hidden="true">{{ d.year }}</span>
                      </time>
                    } @else {
                      <span class="lu-date lu-tip" aria-hidden="true"><i class="pi pi-info-circle"></i><span class="lu-year">Tip</span></span>
                    }
                    <div class="lu-body">
                      <p>{{ n.text }}</p>
                      @if (n.links.length) {
                        <div class="lu-links">
                          @for (l of n.links; track l.url) {
                            <a class="more" [href]="l.url" target="_blank" rel="noopener">{{ l.label }}<i class="pi pi-external-link ext" aria-hidden="true"></i><span class="sr-only"> (opens in a new tab)</span></a>
                          }
                        </div>
                      }
                    </div>
                  </li>
                }
              </ul>
            </p-tabpanel>
            <p-tabpanel value="circular">
              <h2 class="sr-only">Circulars and notifications</h2>
              <p-table [value]="rows" [stripedRows]="true" [paginator]="true" [rows]="10" [scrollable]="true" [tableStyle]="{ 'min-width': '46rem' }">
                <ng-template #header>
                  <tr><th scope="col" style="width:4rem">No.</th><th scope="col" style="width:8rem">GR date</th><th scope="col" style="width:16rem">GR number</th><th scope="col">Title</th><th scope="col" style="width:9rem">Document</th></tr>
                </ng-template>
                <ng-template #body let-r>
                  <tr>
                    <td class="muted">{{ r.no }}</td>
                    <td class="lu-nowrap">{{ r.date }}</td>
                    <td class="lu-grno">{{ r.grNo }}</td>
                    <td class="strong">{{ r.title }}</td>
                    <td>
                      <a pButton size="small" [outlined]="true" [href]="r.link" target="_blank" rel="noopener" [attr.aria-label]="'Download PDF: ' + r.title + ' (opens in a new tab)'">
                        <i class="pi pi-file-pdf" aria-hidden="true"></i> PDF
                      </a>
                    </td>
                  </tr>
                </ng-template>
              </p-table>
            </p-tabpanel>
          </p-tabpanels>
        </p-tabs>

        <div class="card lu-more">
          <div>
            <h2 class="lu-more-title">Looking for schemes or tenders?</h2>
            <p class="muted">Official portals of the Government of Gujarat.</p>
          </div>
          <div class="btn-row">
            <a pButton [outlined]="true" href="https://mariyojana.gujarat.gov.in/" target="_blank" rel="noopener">Government Scheme / Service <i class="pi pi-external-link ext" aria-hidden="true"></i><span class="sr-only"> (opens in a new tab)</span></a>
            <a pButton [outlined]="true" href="https://gil.gujarat.gov.in/Tenders" target="_blank" rel="noopener">Government Tenders <i class="pi pi-external-link ext" aria-hidden="true"></i><span class="sr-only"> (opens in a new tab)</span></a>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class LatestUpdatePage {
  rows = circulars.map((c) => ({ ...c, link: abs(c.url) }));
  news = [
    { date: '17/08/2026', text: 'If you are unable to access scholarship services via Digital Gujarat, you can avail of them at the Gujarat Scholarship portal.', links: [{ label: 'gssp.gujarat.gov.in', url: 'https://gssp.gujarat.gov.in' }] },
    { date: '17/08/2026', text: 'For Academic Year 2026-27, filling Post Matric Scholarship forms on the Digital Gujarat portal for SC students remains re-open from 01/10/2026 to 31/10/2026 for remaining students.', links: [] },
    { date: '17/08/2026', text: 'Applications are invited online for the Post-Matric Scholarship and allied educational schemes for the academic year 2026-27 for Scheduled Tribe students from 01/09/2026 to 30/11/2026.', links: [] },
    { date: '17/08/2026', text: 'Applications are invited again for the Post-Matric Scholarship and allied educational schemes for the academic year 2025-26 for remaining Scheduled Tribe students from 01/10/2026 to 20/10/2026.', links: [] },
    {
      date: '18/07/2025', text: 'Post Matric Scholarships guidelines for Scheduled Caste, SEBC and ST students (2026-27).',
      links: [
        { label: 'For SC students', url: abs('/LoginApp/DownLoad/Guideline for SC Students (DGP) 2026-27.pdf') },
        { label: 'For SEBC students', url: abs('/LoginApp/DownLoad/DCW_Guidiline_26-27.pdf') },
        { label: 'For ST students', url: abs('/LoginApp/DownLoad/2026-27 Guidelines Post-Matric.pdf') },
      ],
    },
    { date: '', text: "Use NIC's SANDES messaging mobile app to get Alert/OTP SMSes related to your Digital Gujarat login instantly.", links: [{ label: 'Android Play Store', url: 'https://play.google.com/store/apps/details?id=in.nic.gimkerala&hl=en_IN&gl=US' }] },
  ].map((n) => ({ ...n, d: parseDate(n.date) }));
}
