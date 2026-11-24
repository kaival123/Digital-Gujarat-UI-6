import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { ButtonDirective } from 'primeng/button';
import { PageHero } from '../shared/page-hero';
import { HELPLINE, SUPPORT_EMAIL } from '../shared/site';
import faq from '../data/faq.json';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-faq',
  imports: [RouterLink, Accordion, AccordionPanel, AccordionHeader, AccordionContent, ButtonDirective, PageHero],
  template: `
    <app-page-hero title="Frequently Asked Questions" subtitle="Quick answers about Digital Gujarat." />
    <section class="section faq-page" data-main tabindex="-1">
      <div class="container faq-layout">
        <aside class="faq-side" aria-labelledby="faq-side-title">
          <div class="card faq-card">
            <span class="icon-tile" aria-hidden="true"><i class="pi pi-question-circle"></i></span>
            <h2 id="faq-side-title" class="faq-side-title">About Digital Gujarat</h2>
            <p class="muted">Digital Gujarat is an online portal launched by the Government of Gujarat to provide various digital services to its citizens — scholarships, income certificates, caste certificates, residence certificates and other essential documents.</p>
            <hr class="faq-rule">
            <h3 class="faq-contact-title">Still have a question?</h3>
            <ul class="faq-contact" role="list">
              <li>
                <i class="pi pi-phone" aria-hidden="true"></i>
                <span><small>Toll free helpline</small><a [href]="'tel:' + helpline.tel">{{ helpline.label }}</a></span>
              </li>
              <li>
                <i class="pi pi-envelope" aria-hidden="true"></i>
                <span><small>Email support</small><a [href]="'mailto:' + email">{{ email }}</a></span>
              </li>
            </ul>
            <a pButton routerLink="/help-desk" class="btn-block"><i class="pi pi-headphones" aria-hidden="true"></i> Contact helpdesk</a>
          </div>
        </aside>

        <div class="faq-main">
          <h2 class="faq-main-title">Common questions <span class="badge">{{ items.length }}</span></h2>
          <p-accordion [value]="0">
            @for (f of items; track $index) {
              <p-accordion-panel [value]="$index">
                <p-accordion-header>{{ f.q }}</p-accordion-header>
                <p-accordion-content>
                  @for (a of f.a; track $index) { <p>{{ a }}</p> }
                </p-accordion-content>
              </p-accordion-panel>
            }
          </p-accordion>
        </div>
      </div>
    </section>
  `,
})
export class FaqPage {
  items = faq;
  helpline = HELPLINE;
  email = SUPPORT_EMAIL;
}
