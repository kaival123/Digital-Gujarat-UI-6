import { Component, ChangeDetectionStrategy, DestroyRef, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Reveal } from '../shared/motion';
import { PageHero } from '../shared/page-hero';
import { IMG, OWNER, abs } from '../shared/site';

interface Topic { label: string; icon: string; }

/** Helpdesk runs 10:00–18:00 every day of the week (India Standard Time). */
const OPEN_MIN = 10 * 60;
const CLOSE_MIN = 18 * 60;

/** Helpdesk page — also the site's "Contact Us" page, so the contact channels come first. */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-help-desk',
  imports: [PageHero, Reveal, RouterLink],
  template: `
    <app-page-hero title="Helpdesk Support" subtitle="Contact us — stuck on an application or a payment? Our support team is one call away." />

    <!-- contact -->
    <section class="section" data-main tabindex="-1" aria-labelledby="hd-contact-h">
      <div class="container hd">
        <div class="hd-copy">
          <span class="hd-status" [class.is-open]="open()" role="status">
            <span class="dot" aria-hidden="true"></span>
            {{ open() ? 'We are online now' : 'Currently closed' }}
            <small>· {{ open() ? 'Closes at 6:00 PM' : 'Opens at 10:00 AM' }} IST</small>
          </span>
          <h2 id="hd-contact-h">Contact us</h2>
          <p>Need support for any service? The support team is available to assist you from <b>10:00 AM to 6:00 PM, Monday through Sunday</b>. Please feel free to reach out during these hours for any assistance you may need.</p>

          <ul class="hd-contact">
            <li>
              <a class="hd-channel" href="tel:18002335500">
                <span class="icon-tile lg" aria-hidden="true"><i class="pi pi-phone"></i></span>
                <span><small>Toll free helpline</small><b>1800 233 5500</b><em>Call free from any phone</em></span>
              </a>
            </li>
            <li>
              <a class="hd-channel" href="mailto:dss-support@gujarat.gov.in">
                <span class="icon-tile lg accent" aria-hidden="true"><i class="pi pi-envelope"></i></span>
                <span><small>Support email ID</small><b>dss-support&#64;gujarat.gov.in</b><em>We reply on working days</em></span>
              </a>
            </li>
            <li>
              <div class="hd-channel">
                <span class="icon-tile lg green" aria-hidden="true"><i class="pi pi-clock"></i></span>
                <span><small>Support hours</small><b>10:00 AM – 6:00 PM</b><em>Monday to Sunday</em></span>
              </div>
            </li>
            <li>
              <div class="hd-channel">
                <span class="icon-tile lg" aria-hidden="true"><i class="pi pi-building"></i></span>
                <span><small>Website managed by</small><b class="sm">{{ owner }}</b></span>
              </div>
            </li>
          </ul>
        </div>

        <div class="hd-art">
          <img [src]="img" alt="Illustration of a helpdesk agent with a headset answering a citizen's query" width="440" height="440">
        </div>
      </div>
    </section>

    <!-- topics -->
    <section class="section alt" aria-labelledby="hd-topics-h">
      <div class="container">
        <div class="section-head">
          <p class="eyebrow"><i class="pi pi-question-circle" aria-hidden="true"></i> Topics</p>
          <h2 id="hd-topics-h">What can we help you with?</h2>
          <p>Our support team is available to help you resolve your queries related to:</p>
        </div>

        <div class="hd-topic-cols">
          <div>
            <h3 class="hd-group"><i class="pi pi-th-large" aria-hidden="true"></i> Services</h3>
            <ul class="hd-list">
              @for (t of services; track t.label) {
                <li><span class="icon-tile"><i [class]="'pi ' + t.icon" aria-hidden="true"></i></span>{{ t.label }}</li>
              }
            </ul>
          </div>
          <div>
            <h3 class="hd-group"><i class="pi pi-wallet" aria-hidden="true"></i> Payments</h3>
            <ul class="hd-list">
              @for (t of payments; track t.label) {
                <li><span class="icon-tile accent"><i [class]="'pi ' + t.icon" aria-hidden="true"></i></span>{{ t.label }}</li>
              }
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- guides -->
    <section class="section" aria-labelledby="hd-guides-h">
      <div class="container">
        <div class="section-head">
          <p class="eyebrow"><i class="pi pi-book" aria-hidden="true"></i> Guides</p>
          <h2 id="hd-guides-h">Guides to get started</h2>
          <p>Download the user manual, or browse the Sugam service guides.</p>
        </div>
        <ul class="hd-guides">
          @for (m of manuals; track m.label) {
            <li appReveal="up">
              <a class="card card-link hd-guide" [href]="m.url" target="_blank" rel="noopener">
                <span class="icon-tile accent" aria-hidden="true"><i class="pi pi-file-pdf"></i></span>
                <span class="tx"><small>Download User Manual (PDF)</small><b>{{ m.label }} <i class="pi pi-external-link ext" aria-hidden="true"></i></b></span>
                <i class="pi pi-download dl" aria-hidden="true"></i><span class="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          }
          <li appReveal="up">
            <a class="card card-link hd-guide" routerLink="/user-manual">
              <span class="icon-tile" aria-hidden="true"><i class="pi pi-book"></i></span>
              <span class="tx"><small>Step-by-step guides</small><b>Sugam User Manual</b></span>
              <i class="pi pi-arrow-right dl" aria-hidden="true"></i>
            </a>
          </li>
        </ul>
      </div>
    </section>

    <!-- still need help -->
    <section class="hd-cta" aria-labelledby="hd-cta-h">
      <div class="container hd-cta-inner">
        <div>
          <h2 id="hd-cta-h">Still need help?</h2>
          <p>Reach us any day, 10:00 AM to 6:00 PM. Call toll free or write to us and we will get back to you.</p>
        </div>
        <div class="btn-row">
          <a class="btn btn-light" href="tel:18002335500"><i class="pi pi-phone" aria-hidden="true"></i> 1800 233 5500</a>
          <a class="btn btn-on-dark" href="mailto:dss-support@gujarat.gov.in"><i class="pi pi-envelope" aria-hidden="true"></i> Email support</a>
          <a class="btn btn-on-dark" routerLink="/feedback"><i class="pi pi-comment" aria-hidden="true"></i> Send feedback</a>
        </div>
      </div>
    </section>
  `,
})
export class HelpDeskPage {
  img = IMG + 'assets/img/support.svg';
  owner = OWNER;

  services: Topic[] = [
    { label: 'Application Related Issue', icon: 'pi-file-edit' },
    { label: 'Scholarship Service Related Issue', icon: 'pi-graduation-cap' },
    { label: 'Sugam Service Related Issue', icon: 'pi-th-large' },
    { label: 'Janseva Service Related Issue', icon: 'pi-users' },
  ];
  payments: Topic[] = [
    { label: 'Payment Related Issue', icon: 'pi-credit-card' },
    { label: 'Payment Failed Related Issue', icon: 'pi-times-circle' },
    { label: 'Payment Refund Related Issue', icon: 'pi-replay' },
    { label: 'Payment Related Other Issue', icon: 'pi-ellipsis-h' },
  ];
  manuals = [
    { label: 'English', url: abs('Download/User_Manual_on_CSP_v1.1.pdf') },
    { label: 'Gujarati', url: abs('Download/GUser_Manual_on_CSP_v1.1.pdf') },
  ];

  private minutes = signal(this.istMinutes());
  open = computed(() => this.minutes() >= OPEN_MIN && this.minutes() < CLOSE_MIN);

  constructor() {
    const id = setInterval(() => this.minutes.set(this.istMinutes()), 30000);
    inject(DestroyRef).onDestroy(() => clearInterval(id));
  }

  private istMinutes() {
    const p = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
    return +p.find((x) => x.type === 'hour')!.value * 60 + +p.find((x) => x.type === 'minute')!.value;
  }
}
