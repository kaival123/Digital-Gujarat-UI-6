import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Dialog } from 'primeng/dialog';
import { Reveal } from '../shared/motion';
import { PageHero } from '../shared/page-hero';
import { IMG, SOCIAL } from '../shared/site';
import videos from '../data/videos.json';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-videos',
  imports: [Dialog, PageHero, Reveal],
  template: `
    <app-page-hero title="Videos" subtitle="Step-by-step video tutorials for Digital Gujarat services." />
    <section class="section" data-main tabindex="-1">
      <div class="container">
        <div class="section-head-row">
          <div class="section-head">
            <p class="eyebrow"><i class="pi pi-video" aria-hidden="true"></i> Video tutorials</p>
            <h2>Learn how to apply online</h2>
            <p>{{ items.length }} short guides. Select a video to play it here.</p>
          </div>
          <a class="btn btn-outline" [href]="yt" target="_blank" rel="noopener">
            <i class="pi pi-youtube" aria-hidden="true"></i> More on YouTube
            <i class="pi pi-external-link ext" aria-hidden="true"></i><span class="sr-only"> (opens in a new tab)</span>
          </a>
        </div>

        <ul class="vd-grid">
          @for (v of items; track v.id; let i = $index) {
            <li [class.vd-featured]="i === 0" appReveal="up">
              <button type="button" class="vd-card" (click)="open(v)">
                <span class="vd-thumb">
                  <img [src]="v.thumb" alt="" loading="lazy" (error)="thumbFallback($event, v.id)">
                  <span class="vd-play" aria-hidden="true"><i class="pi pi-play"></i></span>
                  @if (i === 0) { <span class="badge accent vd-tag">Featured</span> }
                </span>
                <span class="vd-body">
                  <span class="vd-title">{{ v.title }}</span>
                  <span class="vd-meta"><i class="pi pi-youtube" aria-hidden="true"></i> Watch tutorial<span class="sr-only">: play video in a dialog</span></span>
                </span>
              </button>
            </li>
          }
        </ul>
      </div>
    </section>
    <p-dialog [header]="current()?.title ?? ''" [visible]="visible()" (visibleChange)="visible.set($event)" [modal]="true" [dismissableMask]="true" [style]="{ width: 'min(900px, 94vw)' }" (onHide)="stop()">
      @if (visible() && src(); as s) {
        <div class="vd-frame"><iframe [src]="s" [title]="current()?.title ?? 'Video'" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe></div>
      }
    </p-dialog>
  `,
})
export class VideosPage {
  private san = inject(DomSanitizer);
  yt = SOCIAL[2].url;
  items = videos.map((v) => ({ ...v, thumb: v.img ? IMG + encodeURI(v.img) : `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg` }));
  visible = signal(false);
  current = signal<(typeof this.items)[number] | null>(null);
  src = signal<SafeResourceUrl | null>(null);

  open(v: (typeof this.items)[number]) {
    this.current.set(v);
    this.src.set(this.san.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${v.id}?autoplay=1`));
    this.visible.set(true);
  }
  stop() { this.src.set(null); }

  /** If a mirrored thumbnail is missing or fails to load, fall back to the video's own YouTube preview (once). */
  thumbFallback(e: Event, id: string) {
    const img = e.target as HTMLImageElement;
    const yt = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
    if (img.src !== yt) img.src = yt;
  }
}
