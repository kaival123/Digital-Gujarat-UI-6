import { Component, DestroyRef, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IMG, HELPLINE } from '../shared/site';
import { Reveal } from '../shared/motion';
import { PageHero } from '../shared/page-hero';
import { A11yService } from '../shared/a11y.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-about',
  imports: [RouterLink, PageHero, Reveal],
  template: `
    <app-page-hero title="About Us" subtitle="Digital Gujarat — the Government of Gujarat's single window for citizen services." />

    <!-- intro: copy + photo slider -->
    <section class="section" data-main tabindex="-1">
      <div class="container ab-intro">
        <div class="ab-copy" appReveal="up">
          <p class="eyebrow"><i class="pi pi-info-circle" aria-hidden="true"></i> Who we are</p>
          <h2>Digital Gujarat</h2>
          <p>Digital Gujarat is an e-governance platform by the Government of Gujarat, providing streamlined access to essential services like certificates, scholarships, and welfare schemes. It aims to bridge the digital divide and enhance transparency and efficiency in government services.</p>
          <p>With a user-friendly design, the portal brings services directly to citizens, eliminating the need for physical visits to offices. Digital Gujarat empowers residents to access and track government resources anytime, anywhere.</p>
          <div class="btn-row">
            <a class="btn btn-primary" routerLink="/sugam-digital-gujarat">Explore Sugam services <i class="pi pi-arrow-right" aria-hidden="true"></i></a>
            <a class="btn btn-outline" routerLink="/help-desk"><i class="pi pi-phone" aria-hidden="true"></i> Contact support</a>
          </div>
        </div>

        <div class="ab-slider" role="region" aria-roledescription="carousel" aria-label="Digital Gujarat in action"
          (mouseenter)="hover.set(true)" (mouseleave)="hover.set(false)" (focusin)="hover.set(true)" (focusout)="hover.set(false)"
          (keydown.arrowleft)="step(-1)" (keydown.arrowright)="step(1)">
          <div class="ab-frame" [attr.aria-live]="running() ? 'off' : 'polite'" (pointerdown)="down($event)" (pointerup)="up($event)" (pointercancel)="startX = null">
            @for (p of photos; track p.src; let i = $index) {
              <figure class="ab-slide" [class.on]="i === active()" role="group" aria-roledescription="slide"
                [attr.aria-label]="(i + 1) + ' of ' + photos.length" [attr.aria-hidden]="i !== active()">
                <img [src]="p.src" [alt]="p.alt" width="400" height="800" [attr.loading]="i === 0 ? null : 'lazy'" draggable="false">
                <figcaption>{{ p.caption }}</figcaption>
              </figure>
            }
          </div>
          <div class="ab-bar">
            <div class="sl-dots" role="group" aria-label="Choose photo">
              @for (p of photos; track p.src; let i = $index) {
                <button type="button" [attr.aria-label]="'Show photo ' + (i + 1) + ': ' + p.caption" [attr.aria-current]="i === active()" (click)="go(i)"></button>
              }
            </div>
            <div class="sl-controls">
              <button type="button" class="sl-btn" (click)="toggle()" [attr.aria-label]="playing() ? 'Pause slideshow' : 'Play slideshow'">
                <i class="pi" [class.pi-pause]="playing()" [class.pi-play]="!playing()" aria-hidden="true"></i>
              </button>
              <button type="button" class="sl-btn" aria-label="Previous photo" (click)="step(-1)"><i class="pi pi-chevron-left" aria-hidden="true"></i></button>
              <button type="button" class="sl-btn" aria-label="Next photo" (click)="step(1)"><i class="pi pi-chevron-right" aria-hidden="true"></i></button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- what we offer -->
    <section class="section alt" aria-labelledby="ab-offer-h">
      <div class="container">
        <div class="section-head">
          <p class="eyebrow"><i class="pi pi-th-large" aria-hidden="true"></i> What we offer</p>
          <h2 id="ab-offer-h">Government services, made simple</h2>
          <p>One portal to apply for, pay for and track the services you need.</p>
        </div>
        <ul class="ab-features">
          @for (f of features; track f.title) {
            <li class="card" appReveal="up">
              <span class="icon-tile lg"><i [class]="f.icon" aria-hidden="true"></i></span>
              <h3>{{ f.title }}</h3>
              <p>{{ f.text }}</p>
            </li>
          }
        </ul>
      </div>
    </section>

    <!-- vision / mission + key facts -->
    <section class="section" aria-labelledby="ab-vm-h">
      <div class="container">
        <h2 id="ab-vm-h" class="sr-only">Vision, mission and key facts</h2>
        <div class="ab-vm">
          <article class="ab-vm-card">
            <span class="icon-tile accent"><i class="pi pi-eye" aria-hidden="true"></i></span>
            <div>
              <h3>Our vision</h3>
              <p>A digitally empowered Gujarat where every citizen can reach government services transparently, efficiently and without visiting an office.</p>
            </div>
          </article>
          <article class="ab-vm-card">
            <span class="icon-tile green"><i class="pi pi-flag" aria-hidden="true"></i></span>
            <div>
              <h3>Our mission</h3>
              <p>Bring certificates, scholarships and welfare schemes onto one user-friendly portal, and let residents apply, pay and track them anytime, anywhere.</p>
            </div>
          </article>
        </div>
        <dl class="ab-facts">
          @for (f of facts; track f.label) {
            <div>
              <dt>{{ f.label }}</dt>
              <dd><i [class]="f.icon" aria-hidden="true"></i> {{ f.value }}</dd>
            </div>
          }
        </dl>
      </div>
    </section>
  `,
})
export class AboutPage {
  photos = [
    { src: IMG + 'assets/img/about/011.png', alt: 'Two farmers looking at a laptop together in a green field', caption: 'Services reach farmers in the field' },
    { src: IMG + 'assets/img/about/022.png', alt: 'A smiling man using a mobile phone', caption: 'Apply and track from your phone' },
    { src: IMG + 'assets/img/about/033.png', alt: 'A young man working on a laptop near a village cattle shed', caption: 'Bridging the digital divide in villages' },
  ];
  features = [
    { icon: 'pi pi-file-check', title: 'Essential services', text: 'Certificates, scholarships and welfare schemes through a single portal.' },
    { icon: 'pi pi-eye', title: 'Transparent & efficient', text: 'Bridging the digital divide and making government services more transparent.' },
    { icon: 'pi pi-clock', title: 'Anytime, anywhere', text: 'Access and track government resources without visiting an office.' },
  ];
  facts = [
    { icon: 'pi pi-th-large', label: 'Online services', value: '100+' },
    { icon: 'pi pi-globe', label: 'Available', value: '24 × 7' },
    { icon: 'pi pi-language', label: 'Languages', value: 'English & ગુજરાતી' },
    { icon: 'pi pi-phone', label: 'Toll-free helpline', value: HELPLINE.label },
  ];

  private a11y = inject(A11yService);
  active = signal(0);
  hover = signal(false);
  /** User's play/pause choice; starts paused when the visitor asked for reduced motion. */
  playing = signal(!this.a11y.motionOff());
  running = computed(() => this.playing() && !this.hover() && !this.a11y.motionOff());
  startX: number | null = null;

  private timer = setInterval(() => { if (this.running()) this.step(1); }, 5000);
  private _stop = inject(DestroyRef).onDestroy(() => clearInterval(this.timer));

  toggle() { this.playing.update((p) => !p); }
  step(d: number) { this.active.update((a) => (a + d + this.photos.length) % this.photos.length); }
  go(i: number) { this.active.set(i); }
  down(e: PointerEvent) { this.startX = e.clientX; }
  up(e: PointerEvent) {
    if (this.startX === null) return;
    const dx = e.clientX - this.startX;
    this.startX = null;
    if (Math.abs(dx) > 40) this.step(dx < 0 ? 1 : -1);
  }
}
