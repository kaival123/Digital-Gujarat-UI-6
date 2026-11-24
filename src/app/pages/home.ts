import { Component, DestroyRef, ElementRef, computed, inject, signal, viewChild, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { DatePicker } from 'primeng/datepicker';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import { Counter } from '../shared/motion';
import { SearchService } from '../shared/search.service';
import { A11yService } from '../shared/a11y.service';
import { A, HELPLINE, SITE, SUPPORT_EMAIL, abs } from '../shared/site';
import faqData from '../data/faq.json';
import citizenData from '../data/citizen.json';
import sugamData from '../data/sugam.json';
import dssData from '../data/dss.json';
import jansevaData from '../data/janseva.json';
import linkedData from '../data/linked.json';
import videoData from '../data/videos.json';
import circulars from '../data/circulars.json';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-home',
  imports: [FormsModule, RouterLink, DatePicker, Counter, Tabs, TabList, Tab, TabPanels, TabPanel, Accordion, AccordionPanel, AccordionHeader, AccordionContent],
  templateUrl: './home.html',
})
export class HomePage {
  readonly site = SITE;
  readonly helpline = HELPLINE;
  readonly email = SUPPORT_EMAIL;
  searchSvc = inject(SearchService);
  a11y = inject(A11yService);
  private destroy = inject(DestroyRef);

  private pick = (items: { title: string; img: string }[], n = 8) => items.slice(0, n).map((i) => ({ title: i.title, img: A + 'site/' + encodeURI(i.img) }));
  private total = citizenData.length + sugamData.length + dssData.length + jansevaData.length;

  // ---------- hero slider (auto-advances, pausable, stops when motion is off) ----------
  slides = [
    { eyebrow: 'Government of Gujarat', title: 'Discover government schemes made for you', sub: 'Find personalised schemes and certificates based on your eligibility, and apply online from anywhere.', img: A + 'img/slider/hero-farmer-clean.png', pos: 'center', alt: 'A farmer using a laptop in his village', cta: { label: 'Explore services', route: '/services/citizen' } },
    { eyebrow: 'One stop platform', title: 'Apply, pay and track — all in one place', sub: 'Access, apply and track government services and your application status effortlessly.', img: A + 'img/slider/hero-team-clean.png', pos: 'center', alt: 'Citizens using Digital Gujarat services together', cta: { label: 'Register / Login', route: '/citizen-login' } },
    { eyebrow: 'Sugam Digital Gujarat', title: 'Line thi Online — skip the office queue', sub: 'Income, caste and domicile certificates and ration card services, now fully online.', img: A + 'site/assets/img/about/022.png', pos: '50% 4%', alt: 'A citizen using a mobile phone', cta: { label: 'Visit Sugam services', route: '/sugam-digital-gujarat' } },
  ];
  slide = signal(0);
  heroPaused = signal(false);
  private heroHover = false;
  heroAuto = computed(() => !this.heroPaused() && !this.a11y.motionOff());
  private heroTimer = setInterval(() => { if (this.heroAuto() && !this.heroHover) this.goSlide(this.slide() + 1); }, 7000);
  goSlide(i: number) { const n = this.slides.length; this.slide.set((i + n) % n); }
  heroHold(on: boolean) { this.heroHover = on; }

  // ---------- ticker ----------
  tickerPaused = signal(false);
  ticker = [
    'Post-Matric Scholarship 2026-27: SC students re-open 01/10/2026 – 31/10/2026',
    'ST students: applications for 2026-27 open 01/09/2026 – 30/11/2026',
    'Scholarship services are also available at gssp.gujarat.gov.in',
    "Use NIC's SANDES app to get Digital Gujarat login OTPs instantly",
  ];

  // ---------- categories ----------
  categories = [
    { title: 'Citizen Services', text: 'Certificates, passes & documents', icon: A + 'img/icon/citizenservice.svg', count: citizenData.length, route: '/services/citizen' },
    { title: 'Sugam Digital Gujarat', text: 'Apply from home, fully online', icon: A + 'img/icon/eolservice.svg', count: sugamData.length, route: '/sugam-digital-gujarat' },
    { title: 'Digital SevaSetu', text: 'Department schemes & subsidies', icon: A + 'img/icon/digitalsevasetu.svg', count: dssData.length, route: '/services/digital-sevasetu' },
    { title: 'Janseva Services', text: 'Services at Janseva Kendras', icon: A + 'img/icon/jansevaservice.svg', count: jansevaData.length, route: '/services/janseva' },
    { title: 'Scholarship Services', text: 'On the GSSP portal', icon: A + 'img/icon/scholarship.svg', count: null as number | null, url: 'https://gssp.gujarat.gov.in/' },
    { title: 'Linked Services', text: 'Other departments & corporations', icon: A + 'img/icon/citizenservice.svg', count: linkedData.rows.length, route: '/services/linked' },
  ];

  explorer = [
    { key: 'citizen', label: 'Citizen', icon: 'pi pi-users', route: '/services/citizen', total: citizenData.length, items: this.pick(citizenData), blurb: 'Certificates, passes and everyday documents.' },
    { key: 'sugam', label: 'Sugam', icon: 'pi pi-bolt', route: '/sugam-digital-gujarat', total: sugamData.length, items: this.pick(sugamData), blurb: 'Caste, income and ration card services — fully online.' },
    { key: 'dss', label: 'Digital SevaSetu', icon: 'pi pi-briefcase', route: '/services/digital-sevasetu', total: dssData.length, items: this.pick(dssData), blurb: 'Department schemes and subsidies.' },
    { key: 'janseva', label: 'Janseva', icon: 'pi pi-building', route: '/services/janseva', total: jansevaData.length, items: this.pick(jansevaData), blurb: 'Affidavits and services from Janseva Kendras.' },
  ];

  stats = [
    { icon: 'pi pi-th-large', value: this.total, suffix: '+', label: 'Services online' },
    { icon: 'pi pi-link', value: linkedData.rows.length, suffix: '', label: 'Linked department services' },
    { icon: 'pi pi-video', value: videoData.length, suffix: '', label: 'Video tutorials' },
    { icon: 'pi pi-users', value: 486718029, suffix: '', label: 'Portal visitors' },
  ];

  // ---------- popular services (scroll-snap slider) ----------
  trending = [
    { title: 'Income Certificate', img: A + 'citizen/Income.png', tag: 'Most applied' },
    { title: 'Addition of Name in Ration Card', img: A + 'citizen/AddName_RC.png', tag: 'Popular' },
    { title: 'Widow Certificate', img: A + 'citizen/Widow.png', tag: 'Popular' },
    { title: 'Domicile Certificate (By Birth)', img: A + 'citizen/Domicile.png', tag: 'Popular' },
    { title: 'Senior Citizen Certificate', img: A + 'citizen/SeniorCitizen.png', tag: 'Popular' },
  ];
  private trendTrack = viewChild<ElementRef<HTMLElement>>('trendTrack');
  scrollTrend(dir: number) {
    const el = this.trendTrack()?.nativeElement;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('.pop-card');
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 280) + 20), behavior: this.a11y.motionOff() ? 'auto' : 'smooth' });
  }

  steps = [
    { icon: 'pi pi-user-plus', title: 'Register', text: 'Choose Login / Register → Citizen Login and create your account on Citizen SSO.' },
    { icon: 'pi pi-search', title: 'Choose a service', text: 'Search or browse certificates, schemes and scholarships, e.g. Income Certificate.' },
    { icon: 'pi pi-upload', title: 'Upload documents', text: 'Attach proofs such as salary slips or bank statements and submit the application.' },
    { icon: 'pi pi-check-circle', title: 'Track status', text: "Follow progress anytime under 'My Applications' after you log in." },
  ];

  news = [
    { date: '17/08/2026', text: 'Unable to access scholarship services on Digital Gujarat? Avail them at the Gujarat Scholarship portal (gssp.gujarat.gov.in).' },
    { date: '17/08/2026', text: 'Post Matric Scholarship forms for SC students re-open from 01/10/2026 to 31/10/2026 for remaining students (AY 2026-27).' },
    { date: '17/08/2026', text: 'Online applications invited for Post-Matric Scholarship for ST students from 01/09/2026 to 30/11/2026.' },
    { date: '18/07/2025', text: 'Post Matric Scholarship guidelines for SC, SEBC and ST students (2026-27) are now available.' },
  ];
  circulars = circulars.slice(0, 4).map((c) => ({ ...c, link: abs(c.url) }));
  dateParts(d: string) { const [dd, mm, yy] = d.split('/'); return { d: dd, m: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+mm - 1], y: yy }; }

  perks = [
    { icon: 'pi pi-home', text: 'Apply from home — skip the office queue' },
    { icon: 'pi pi-file-check', text: 'Income, caste and domicile certificates' },
    { icon: 'pi pi-id-card', text: 'Ration card services and 20+ essential services' },
    { icon: 'pi pi-mobile', text: 'Track your application status anytime' },
  ];

  faqs = faqData.slice(0, 5);

  // ---------- glimpses (slider + lightbox) ----------
  glimpses = [
    { title: 'Great Rann of Kutch', img: A + 'img/GlimpsesSlider/runnofkutch.png' },
    { title: 'Statue of Unity', img: A + 'img/GlimpsesSlider/statueofunity.png' },
    { title: 'International Kite Festival', img: A + 'img/GlimpsesSlider/kitefestival.png' },
    { title: 'Vibrant Gujarat', img: A + 'img/GlimpsesSlider/vibrant.png' },
  ];
  gIndex = signal(0);
  goGlimpse(i: number) { const n = this.glimpses.length; this.gIndex.set((i + n) % n); }

  private lastFocus: HTMLElement | null = null;
  viewer = signal<{ title: string; img: string } | null>(null);
  zoom = signal(1);
  rot = signal(0);
  openViewer(g: { title: string; img: string }) {
    this.lastFocus = document.activeElement as HTMLElement | null;
    this.zoom.set(1); this.rot.set(0); this.viewer.set(g);
    setTimeout(() => document.querySelector<HTMLElement>('.lightbox-tools button:last-child')?.focus(), 30);
  }
  closeViewer() { this.viewer.set(null); this.lastFocus?.focus(); }
  zoomBy(d: number) { this.zoom.update((z) => Math.min(4, Math.max(0.3, +(z + d).toFixed(2)))); }
  rotateBy(d: number) { this.rot.update((r) => r + d); }

  calendarDate: Date = new Date();

  // ---------- important links (logo marquee with pause) ----------
  partnersPaused = signal(false);
  partners = [
    { name: 'ITU WTSA New Delhi 2024', img: A + 'img/partner/img1.png', url: 'https://www.delhiwtsa24.in/' },
    { name: 'Gujarat India', img: A + 'img/partner/img2.png', url: 'https://gujaratindia.gov.in/index' },
    { name: 'India.gov.in – National Portal of India', img: A + 'img/partner/img3.png', url: 'https://india.gov.in/' },
    { name: 'Gujarat Tourism', img: A + 'img/partner/img4.png', url: 'https://www.gujarattourism.com/' },
    { name: 'Statue of Unity Tickets', img: A + 'img/partner/img5.png', url: 'https://www.soutickets.in/#/dashboard' },
    { name: 'Swachh Bharat Mission', img: A + 'img/partner/img6.png', url: 'https://swachhbharatmission.ddws.gov.in/' },
    { name: 'SWAGAT', img: A + 'img/partner/img7.png', url: 'https://swagat.gujarat.gov.in/' },
    { name: 'GIGW 3.0', img: A + 'img/partner/img8.png', url: 'https://guidelines.india.gov.in/new-features-of-gigw-3-0/' },
    { name: 'GIGW 3.0 Guidelines', img: A + 'img/partner/img9.png', url: 'https://guidelines.india.gov.in/new-features-of-gigw-3-0/' },
  ];

  openSearch(q = '') { this.searchSvc.show(q); }

  constructor() { this.destroy.onDestroy(() => clearInterval(this.heroTimer)); }
}
