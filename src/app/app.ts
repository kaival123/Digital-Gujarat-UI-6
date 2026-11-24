import { Component, HostListener, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { CommandPalette } from './shared/command-palette';
import { SearchService } from './shared/search.service';
import { initScrollLock } from './shared/scroll-lock';
import { A11yService, A11Y_PROFILES, A11yProfile } from './shared/a11y.service';
import { HELPLINE, IMPORTANT_LINKS, LAST_UPDATED, LOGIN_MENU, NAV, OWNER, POLICY_LINKS, QUICK_LINKS, SITE, SOCIAL, SUPPORT_EMAIL } from './shared/site';

interface A11yTile { label: string; icon: string; on: () => boolean; run: () => void; level?: () => number; badge?: boolean }

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommandPalette, FormsModule, RouterLink, RouterLinkActive, RouterOutlet, Menu],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  readonly site = SITE;
  readonly year = new Date().getFullYear();
  readonly nav = NAV;
  readonly loginMenu = LOGIN_MENU;
  readonly quickLinks = QUICK_LINKS;
  readonly importantLinks = IMPORTANT_LINKS;
  readonly policyLinks = POLICY_LINKS;
  readonly social = SOCIAL;
  readonly helpline = HELPLINE;
  readonly email = SUPPORT_EMAIL;
  readonly owner = OWNER;
  readonly lastUpdated = LAST_UPDATED;

  search = inject(SearchService);
  a11y = inject(A11yService);
  private router = inject(Router);

  scrolled = signal(false);
  navigating = signal(false);
  private ticking = false;

  constructor() {
    initScrollLock();
    let navTimer: ReturnType<typeof setTimeout> | undefined;
    this.router.events.subscribe((e) => {
      // only show the bar if a navigation is still pending after 150ms, so fast page changes never flash it
      if (e instanceof NavigationStart) { clearTimeout(navTimer); navTimer = setTimeout(() => this.navigating.set(true), 150); }
      else if (e instanceof NavigationEnd || e instanceof NavigationCancel || e instanceof NavigationError) {
        clearTimeout(navTimer); this.navigating.set(false); this.mobileNav.set(false); this.openSub.set(null);
      }
    });
    // Passive + rAF-throttled: scrolling never blocks, and signals only change when the value does.
    window.addEventListener('scroll', () => {
      if (this.ticking) return;
      this.ticking = true;
      requestAnimationFrame(() => {
        this.ticking = false;
        const s = document.documentElement.scrollTop > 140;
        if (s !== this.scrolled()) this.scrolled.set(s);
      });
    }, { passive: true });
  }

  // ---- primary navigation (custom, keyboard + touch friendly) ----
  mobileNav = signal(false);
  openSub = signal<number | null>(null);
  private subTimer: ReturnType<typeof setTimeout> | undefined;
  toggleSub(i: number) { this.openSub.update((o) => (o === i ? null : i)); }
  hoverSub(i: number, enter: boolean) {
    if (!matchMedia('(hover: hover) and (min-width: 1100px)').matches) return;
    clearTimeout(this.subTimer);
    if (enter) this.openSub.set(i);
    else this.subTimer = setTimeout(() => { if (this.openSub() === i) this.openSub.set(null); }, 160);
  }
  closeNav() { this.mobileNav.set(false); this.openSub.set(null); }
  isSectionActive(item: MenuItem) {
    return (item.items ?? []).some((s) => typeof s.routerLink === 'string' && this.router.url.startsWith(s.routerLink));
  }
  toTop() {
    window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    document.querySelector<HTMLElement>('.brand')?.focus({ preventScroll: true });
  }

  @HostListener('document:keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    const typing = /input|textarea|select/i.test((e.target as HTMLElement)?.tagName ?? '');
    if (e.ctrlKey && e.key === 'F2') { e.preventDefault(); this.toggleA11yByKey(); return; }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); this.search.open.update((o) => !o); }
    else if (e.key === '/' && !typing) { e.preventDefault(); this.search.show(); }
  }

  @HostListener('document:click', ['$event'])
  closeMenus(e: Event) {
    const t = e.target as Element;
    if (!t?.closest?.('.nav-item.has-sub')) this.openSub.set(null);
    if (!t?.closest?.('.gt-theme')) this.themeOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  onEscape() { this.openSub.set(null); this.themeOpen.set(false); if (this.mobileNav()) this.mobileNav.set(false); if (this.a11yOpen()) this.closeA11y(); }

  // ---- accessibility drawer ----
  a11yOpen = signal(false);
  a11yView = signal<'grid' | 'list'>('grid');
  a11yOpenSections = signal<Record<string, boolean>>({ profile: false, color: true, content: true, orient: true });
  readonly profiles = A11Y_PROFILES;
  private a11yTrigger: HTMLElement | null = null;

  openA11y(e: Event) {
    e.stopPropagation();
    if (this.a11yOpen()) { this.closeA11y(); return; }
    this.a11yTrigger = e.currentTarget as HTMLElement;
    this.a11yOpen.set(true);
    setTimeout(() => document.querySelector<HTMLElement>('.ax-close')?.focus(), 60);
  }
  closeA11y() { this.a11yOpen.set(false); this.a11yTrigger?.focus(); }
  toggleA11yByKey() {
    if (this.a11yOpen()) { this.closeA11y(); return; }
    this.a11yTrigger = document.activeElement as HTMLElement | null;
    this.a11yOpen.set(true);
    setTimeout(() => document.querySelector<HTMLElement>('.ax-close')?.focus(), 60);
  }
  toggleSection(k: string) { this.a11yOpenSections.update((s) => ({ ...s, [k]: !s[k] })); }
  activeProfile = signal<string | null>(null);
  applyProfile(p: A11yProfile) {
    if (this.activeProfile() === p.key) { this.resetA11y(); return; } // tapping the active profile turns it off
    this.a11y.applyProfile(p); this.setFontScale(p.text ?? 100); this.activeProfile.set(p.key);
  }
  resetA11y() { this.activeProfile.set(null); this.a11y.reset(); this.setFontScale(100); if (this.dark()) this.toggleDark(false); }

  /** 0 = normal, 1 = 115 %, 2 = 130 % */
  textLevel = computed(() => (this.fontScale() >= 130 ? 2 : this.fontScale() >= 115 ? 1 : 0));
  cycleText() { this.setFontScale([115, 130, 100][this.textLevel()]); }

  private tile(label: string, icon: string, on: () => boolean, run: () => void, level?: () => number): A11yTile { return { label, icon, on, run, level }; }
  readonly colorTiles: A11yTile[] = [
    this.tile('Monochrome', 'svg:drop-dots', () => this.a11y.prefs().gray, () => this.a11y.toggle('gray')),
    this.tile('High Saturate', 'svg:drop-half', () => this.a11y.prefs().satHigh, () => this.a11y.setSaturation('satHigh')),
    this.tile('Low Saturate', 'svg:drop-fade', () => this.a11y.prefs().satLow, () => this.a11y.setSaturation('satLow')),
    this.tile('Dark Mode', 'pi-moon', () => this.dark(), () => this.toggleDark(!this.dark())),
    this.tile('Invert Color', 'pi-sync', () => this.a11y.prefs().invert, () => this.a11y.toggle('invert')),
    this.tile('High Contrast', 'pi-eye', () => this.a11y.prefs().contrast, () => this.a11y.toggle('contrast')),
  ];
  readonly contentTiles: A11yTile[] = [
    this.tile('Bigger Text', 'A+', () => this.textLevel() > 0, () => this.cycleText(), () => this.textLevel()),
    this.tile('Line Height', 'svg:lineh', () => this.a11y.prefs().lineh > 0, () => this.a11y.cycle('lineh'), () => this.a11y.prefs().lineh),
    this.tile('Text Spacing', 'svg:spacing', () => this.a11y.prefs().spacing > 0, () => this.a11y.cycle('spacing'), () => this.a11y.prefs().spacing),
    this.tile('Highlight Links', 'pi-link', () => this.a11y.prefs().links, () => this.a11y.toggle('links')),
    this.tile('Dyslexia Friendly', 'Df', () => this.a11y.prefs().dyslexia, () => this.a11y.toggle('dyslexia')),
    { ...this.tile('Text Magnify', 'pi-search-plus', () => this.a11y.prefs().magnify, () => this.a11y.toggle('magnify')), badge: true },
    this.tile('Cursor Size', 'pi-arrow-up-left', () => this.a11y.prefs().cursor > 0, () => this.a11y.cycle('cursor'), () => Math.min(2, this.a11y.prefs().cursor)),
  ];
  readonly orientTiles: A11yTile[] = [
    this.tile('Screen Reader', 'pi-volume-up', () => this.a11y.prefs().reader, () => this.a11y.toggle('reader')),
    this.tile('Voice Support', 'pi-microphone', () => this.a11y.prefs().voice, () => this.a11y.toggle('voice')),
    this.tile('Pause Animation', 'pi-pause', () => this.a11y.prefs().motion, () => this.a11y.toggle('motion')),
    this.tile('Hide Images', 'pi-image', () => this.a11y.prefs().images, () => this.a11y.toggle('images')),
    this.tile('Focus Mode', 'pi-bullseye', () => this.a11y.prefs().focusMode, () => this.a11y.toggle('focusMode')),
    this.tile('Reading Guides', 'pi-align-justify', () => this.a11y.prefs().guide, () => this.a11y.toggle('guide')),
    this.tile('Focus Ring', 'pi-stop', () => this.a11y.prefs().focus, () => this.a11y.toggle('focus')),
    this.tile('Light Mode', 'pi-wifi', () => this.a11y.prefs().lite, () => this.a11y.toggle('lite')),
  ];

  // ---- display preferences ----
  dark = signal(false);
  fontScale = signal(100);
  languages = [
    { label: 'English', code: 'en' },
    { label: 'ગુજરાતી', code: 'gu' },
  ];
  language = this.languages[0];
  setLanguage(code: string) { this.language = this.languages.find((l) => l.code === code) ?? this.languages[0]; document.documentElement.lang = code; }

  // ---- colour themes (html[data-theme]; values live in tokens.scss) ----
  readonly themes = [
    { key: 'blue', name: 'Govt Blue', color: '#0b4ea2' },
    { key: 'saffron', name: 'Saffron', color: '#a64b00' },
    { key: 'green', name: 'Green', color: '#0f6b34' },
    { key: 'teal', name: 'Teal', color: '#0b6577' },
    { key: 'maroon', name: 'Maroon', color: '#9b1b44' },
    { key: 'purple', name: 'Purple', color: '#5136a8' },
  ];
  theme = signal(this.readTheme());
  themeOpen = signal(false);
  private readTheme() {
    let k = 'blue';
    try { k = localStorage.getItem('dg-theme') ?? 'blue'; } catch { /* storage unavailable */ }
    if (!['blue', 'saffron', 'green', 'teal', 'maroon', 'purple'].includes(k)) k = 'blue';
    if (k !== 'blue') document.documentElement.dataset['theme'] = k;
    return k;
  }
  setTheme(k: string) {
    this.theme.set(k);
    const root = document.documentElement;
    if (k === 'blue') delete root.dataset['theme']; else root.dataset['theme'] = k;
    try { localStorage.setItem('dg-theme', k); } catch { /* storage unavailable */ }
  }

  toggleDark(on: boolean) { this.dark.set(on); document.documentElement.classList.toggle('app-dark', on); }

  /** GIGW contrast switcher: standard, dark, or high contrast (black / yellow). */
  setContrast(mode: 'standard' | 'dark' | 'high') {
    const high = this.a11y.prefs().contrast;
    if (mode === 'high') { if (!high) this.a11y.toggle('contrast'); if (this.dark()) this.toggleDark(false); return; }
    if (high) this.a11y.toggle('contrast');
    this.toggleDark(mode === 'dark');
  }

  setFontScale(v: number) { this.fontScale.set(v); document.documentElement.style.fontSize = v + '%'; }
  setFont(delta: number) { this.setFontScale(delta === 0 ? 100 : Math.min(130, Math.max(90, this.fontScale() + delta))); }

  /** Jump past the banner/breadcrumb to the first real content block of the current page. */
  skipToMain(e: Event) {
    e.preventDefault();
    const el = document.querySelector<HTMLElement>('[data-main]') ?? document.getElementById('main-content');
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    el?.focus({ preventScroll: true });
  }
}
