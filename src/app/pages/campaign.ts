import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { Image } from 'primeng/image';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import { Reveal } from '../shared/motion';
import { PageHero } from '../shared/page-hero';
import { IMG, SITE } from '../shared/site';

const P = IMG + 'assets/img/';
const hoardings = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({ src: P + `hoarding/hoardings0${n}.jpg`, alt: `Digital Gujarat campaign hoarding ${n} of 8` }));

type TabKey = 'all' | 'videos' | 'standee' | 'bus' | 'hoardings';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-campaign',
  imports: [Image, Tabs, TabList, Tab, TabPanels, TabPanel, PageHero, Reveal],
  template: `
    <app-page-hero title="Promotional Campaign" subtitle="Promoting digital services and initiatives for a better tomorrow." />
    <section class="section" data-main tabindex="-1">
      <div class="container">
        <div class="section-head">
          <p class="eyebrow"><i class="pi pi-megaphone" aria-hidden="true"></i> Campaign material</p>
          <h2>Spreading the word across Gujarat</h2>
          <p>TV commercials, standees, bus panels and hoardings used to bring citizens to Digital Gujarat. Select an image to enlarge it.</p>
        </div>

        <p-tabs [value]="tab()" (valueChange)="tab.set($any($event))" [scrollable]="true">
          <p-tablist>
            <p-tab value="all"><i class="pi pi-th-large" aria-hidden="true"></i> All Campaigns</p-tab>
            <p-tab value="videos"><i class="pi pi-video" aria-hidden="true"></i> Videos</p-tab>
            <p-tab value="standee">Standee <span class="count">{{ standee.length }}</span></p-tab>
            <p-tab value="bus">Bus Panel <span class="count">{{ bus.length }}</span></p-tab>
            <p-tab value="hoardings">Hoardings <span class="count">{{ hoardings.length }}</span></p-tab>
          </p-tablist>
          <p-tabpanels>
            <p-tabpanel value="all">
              <ul class="cp-cards">
                @for (c of cards; track c.title) {
                  <li class="card cp-card" appReveal="up">
                    <span class="cp-media"><img [src]="c.img" alt="" loading="lazy"></span>
                    <div class="cp-body">
                      <h3>{{ c.title }}</h3>
                      <p class="cp-sub">{{ c.sub }}</p>
                      <p>{{ c.text }}</p>
                      <button type="button" class="link-arrow cp-go" (click)="tab.set(c.tab)">
                        View {{ c.title.toLowerCase() }} <i class="pi pi-arrow-right" aria-hidden="true"></i>
                      </button>
                    </div>
                  </li>
                }
              </ul>
            </p-tabpanel>

            <p-tabpanel value="videos">
              <div class="cp-videos card">
                <span class="icon-tile lg"><i class="pi pi-video" aria-hidden="true"></i></span>
                <div>
                  <h3>Campaign videos</h3>
                  <p>Campaign TV commercials are hosted on the official portal.</p>
                  <a class="btn btn-primary" [href]="site + 'Campaign.aspx'" target="_blank" rel="noopener">
                    <i class="pi pi-play" aria-hidden="true"></i> Watch campaign videos
                    <i class="pi pi-external-link ext" aria-hidden="true"></i><span class="sr-only"> (opens in a new tab)</span>
                  </a>
                </div>
              </div>
            </p-tabpanel>

            <p-tabpanel value="standee">
              <ul class="cp-gallery">
                @for (g of standee; track g.src) {
                  <li><p-image [src]="g.src" [alt]="g.alt" [preview]="true" appendTo="body" imageClass="cp-img" /><span class="cp-cap">{{ g.cap }}</span></li>
                }
              </ul>
            </p-tabpanel>
            <p-tabpanel value="bus">
              <ul class="cp-gallery">
                @for (g of bus; track g.src) {
                  <li><p-image [src]="g.src" [alt]="g.alt" [preview]="true" appendTo="body" imageClass="cp-img" /><span class="cp-cap">{{ g.cap }}</span></li>
                }
              </ul>
            </p-tabpanel>
            <p-tabpanel value="hoardings">
              <ul class="cp-gallery">
                @for (g of hoardings; track g.src) {
                  <li><p-image [src]="g.src" [alt]="g.alt" [preview]="true" appendTo="body" imageClass="cp-img" /></li>
                }
              </ul>
            </p-tabpanel>
          </p-tabpanels>
        </p-tabs>
      </div>
    </section>
  `,
})
export class CampaignPage {
  site = SITE;
  tab = signal<TabKey>('all');
  standee = [
    { src: P + 'standeebuspanel/standeedesign.jpeg', alt: 'Digital Gujarat standee design', cap: 'Design' },
    { src: P + 'standeebuspanel/standeemockup.jpeg', alt: 'Digital Gujarat standee mock-up', cap: 'Mock-up' },
  ];
  bus = [
    { src: P + 'standeebuspanel/buspaneldesign.jpeg', alt: 'Digital Gujarat bus panel design', cap: 'Design' },
    { src: P + 'standeebuspanel/buspanelmockup.jpeg', alt: 'Digital Gujarat bus panel mock-up on a bus', cap: 'Mock-up' },
  ];
  hoardings = hoardings;
  cards: { title: string; sub: string; text: string; img: string; tab: TabKey }[] = [
    { title: 'Videos', sub: 'Watch our campaign videos', text: 'Promoting digital services and initiatives for a better tomorrow.', img: P + 'promotion04.jpg', tab: 'videos' },
    { title: 'Standee', sub: 'View campaign standees', text: 'Promoting digital services and initiatives for a better tomorrow.', img: P + 'promotion01.jpg', tab: 'standee' },
    { title: 'Bus Panel', sub: 'On-road campaign visibility', text: 'Reaching citizens across cities and towns.', img: P + 'promotion02.jpg', tab: 'bus' },
    { title: 'Hoardings', sub: 'Outdoor campaign reach', text: 'Spreading awareness across Gujarat with impactful hoardings.', img: P + 'promotion03.jpg', tab: 'hoardings' },
  ];
}
