import { ChangeDetectionStrategy, Component, ElementRef, afterNextRender, computed, signal, viewChild } from '@angular/core';
import { PageHero } from '../shared/page-hero';
import { SITE } from '../shared/site';

type IdType = '' | 'mobile' | 'citizen';

const LOGIN_APP = SITE + 'loginapp/';
const DOWNLOADS = SITE + 'LoginApp/DownLoad/';
const COMMON = ['abc', 'xyz', 'qwerty', 'password', 'admin', 'welcome', 'india', 'gujarat'];
const SEQUENCES = ['123', '234', '345', '456', '567', '678', '789', '987', '876', '765'];
const CAPTCHA_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

interface NewsItem { tone: 'info' | 'alert'; text: string; links?: { label: string; url: string }[]; }

/**
 * Citizen Login — the redesigned front of https://www.digitalgujarat.gov.in/loginapp/CitizenLogin.aspx.
 * Content, fields, password policy and notices mirror the official page. The sign-in itself needs the portal's server session,
 * captcha and salted hash, so this page validates everything locally and then hands the user over to the official portal:
 * the typed password is never stored or sent anywhere by this app.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-citizen-login',
  imports: [PageHero],
  template: `
    <app-page-hero title="Citizen Login" subtitle="Sign in to apply, pay and track 100+ Government of Gujarat services — all in one place." [trail]="[{ label: 'Login' }]" />

    <section class="section cl" data-main tabindex="-1">
      <div class="container cl-grid">
        <!-- ================= Registered user (login form) ================= -->
        <article class="cl-card cl-main" aria-labelledby="cl-main-h">
          <header class="cl-head">
            <span class="icon-tile lg" aria-hidden="true"><i class="pi pi-lock"></i></span>
            <div>
              <h2 id="cl-main-h">Registered User</h2>
              <p>Registered users can login to access their account and 100+ services.</p>
            </div>
          </header>

          <div class="notice success">
            <i class="pi pi-info-circle" aria-hidden="true"></i>
            <p lang="gu">ડિજિટલ ગુજરાત પોર્ટલ પર તમામ વિદ્યાર્થી/સીટીઝન પોતાના મોબાઇલ નંબર થી અગાઉની જેમ લોગીન કરી શકશે જેની નોંધ લેવા વિનંતી છે.</p>
          </div>
          <div class="notice warn">
            <i class="pi pi-exclamation-triangle" aria-hidden="true"></i>
            <p>Kindly update your password (using “Forgot Password?”) as per the new policy. It is necessary to change the password every 90 days.</p>
          </div>

          <a class="btn btn-outline btn-sm cl-know" [href]="login + 'KnowYourID.aspx'" target="_blank" rel="noopener">
            <i class="pi pi-search" aria-hidden="true"></i> Know Your Citizen ID
            <i class="pi pi-external-link ext" aria-hidden="true"></i><span class="sr-only"> (opens in a new tab)</span>
          </a>

          @if (stage() === 'form') {
            <form class="cl-form" (submit)="submit($event)" novalidate autocomplete="off" aria-label="Citizen login">
              <!-- login type -->
              <div class="cl-field">
                <label for="cl-type">Login with <span class="req" aria-hidden="true">*</span></label>
                <div class="cl-input">
                  <i class="pi pi-id-card cl-lead" aria-hidden="true"></i>
                  <select id="cl-type" [value]="idType()" (change)="setType($any($event.target).value)" aria-required="true">
                    <option value="">Select</option>
                    <option value="mobile">Mobile No</option>
                    <option value="citizen">CitizenId</option>
                  </select>
                  <i class="pi pi-angle-down cl-caret" aria-hidden="true"></i>
                </div>
              </div>

              <!-- user name -->
              <div class="cl-field" [class.is-bad]="userTouched() && !userOk()" [class.is-good]="userOk()">
                <label for="cl-user">{{ userLabel() }} <span class="req" aria-hidden="true">*</span></label>
                <div class="cl-input">
                  <i class="pi pi-user cl-lead" aria-hidden="true"></i>
                  <input id="cl-user" type="text" [value]="username()" (input)="setUser($any($event.target).value)" (blur)="userTouched.set(true)"
                    [disabled]="!idType()" [attr.inputmode]="idType() === 'mobile' ? 'numeric' : 'text'" [attr.maxlength]="idType() === 'mobile' ? 10 : 30"
                    [placeholder]="idType() ? userPlaceholder() : 'Select a login type first'" autocomplete="off" aria-required="true" aria-describedby="cl-user-msg" [attr.aria-invalid]="userTouched() && !userOk()">
                  @if (userOk()) { <i class="pi pi-check-circle cl-state" aria-hidden="true"></i> }
                </div>
                <small id="cl-user-msg" class="cl-msg" aria-live="polite">@if (userTouched() && !userOk()) { {{ userError() }} }</small>
              </div>

              <!-- password -->
              <div class="cl-field">
                <label for="cl-pass">Password <span class="req" aria-hidden="true">*</span></label>
                <div class="cl-input">
                  <i class="pi pi-key cl-lead" aria-hidden="true"></i>
                  <input id="cl-pass" [type]="showPw() ? 'text' : 'password'" [value]="password()" (input)="password.set($any($event.target).value)" maxlength="20"
                    placeholder="Your password" autocomplete="off" aria-required="true" aria-describedby="cl-policy">
                  <button type="button" class="cl-eye" (click)="showPw.set(!showPw())" [attr.aria-label]="showPw() ? 'Hide password' : 'Show password'" [attr.aria-pressed]="showPw()">
                    <i class="pi" [class.pi-eye]="!showPw()" [class.pi-eye-slash]="showPw()" aria-hidden="true"></i>
                  </button>
                </div>
                <div class="cl-meter" role="progressbar" aria-label="Password policy progress" aria-valuemin="0" aria-valuemax="100" [attr.aria-valuenow]="strength()">
                  <i [style.width.%]="strength()" [attr.data-level]="strengthLevel()"></i>
                </div>
              </div>

              <!-- policy -->
              <div class="cl-policy" id="cl-policy">
                <b>Password policy</b>
                <ul>
                  @for (r of rules(); track r.id) {
                    <li [class.pass]="r.state === 'pass'" [class.fail]="r.state === 'fail'" [class.info]="r.state === 'info'">
                      <i class="pi" [class.pi-check]="r.state === 'pass'" [class.pi-times]="r.state === 'fail'" [class.pi-circle]="r.state === 'idle'" [class.pi-info-circle]="r.state === 'info'" aria-hidden="true"></i>
                      <span>{{ r.text }}</span>
                      <span class="sr-only">{{ r.state === 'pass' ? '— met' : r.state === 'fail' ? '— not met' : '' }}</span>
                    </li>
                  }
                </ul>
              </div>

              <!-- captcha -->
              <div class="cl-field cl-captcha" [class.is-bad]="captchaTouched() && !captchaOk()" [class.is-good]="captchaOk()">
                <label for="cl-captcha">Enter captcha <span class="req" aria-hidden="true">*</span></label>
                <div class="cl-captcha-row">
                  <div class="cl-input">
                    <i class="pi pi-shield cl-lead" aria-hidden="true"></i>
                    <input id="cl-captcha" type="text" [value]="captchaInput()" (input)="captchaInput.set($any($event.target).value)" (blur)="captchaTouched.set(true)" maxlength="5"
                      placeholder="Enter captcha*" autocomplete="off" autocapitalize="characters" spellcheck="false" aria-required="true">
                    @if (captchaOk()) { <i class="pi pi-check-circle cl-state" aria-hidden="true"></i> }
                  </div>
                  <canvas #cap class="cl-cap-img" width="150" height="48" role="img" aria-label="Captcha image. Use the refresh button for a new one."></canvas>
                  <button type="button" class="sl-btn cl-refresh" [class.spin]="spinning()" (click)="refreshCaptcha()" aria-label="Refresh captcha"><i class="pi pi-refresh" aria-hidden="true"></i></button>
                </div>
              </div>

              <ul class="cl-hints">
                <li><i class="pi pi-arrow-right" aria-hidden="true"></i> The login button will be enabled if the password meets the policy requirements.</li>
                <li lang="gu"><i class="pi pi-arrow-right" aria-hidden="true"></i> પાસવર્ડ પોલીસી પ્રમાણે હશે તો જ લોગિન બટન સક્રિય થશે.</li>
              </ul>

              <button type="submit" class="btn btn-primary btn-lg btn-block cl-submit" [disabled]="!canLogin()" [attr.aria-describedby]="'cl-todo'">
                <span>Login</span><i class="pi pi-arrow-right" aria-hidden="true"></i>
              </button>
              <p id="cl-todo" class="cl-todo" aria-live="polite">@if (!canLogin()) { Still needed: {{ todo() }}. }</p>

              <p class="cl-forgot">Forgot Password?
                <a [href]="login + 'CitizenForgotPassword.aspx'" target="_blank" rel="noopener">Click here<i class="pi pi-external-link ext" aria-hidden="true"></i><span class="sr-only"> (opens in a new tab)</span></a>
              </p>
            </form>
          } @else {
            <div class="cl-handoff" role="status">
              <svg class="cl-tick" viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="24" /><path d="M15 27l8 8 14-16" /></svg>
              <h3>Details look good</h3>
              <p>For your security, the final sign-in is completed on the official Digital Gujarat portal, which verifies your password and captcha on its own server. Nothing you typed here has been stored or sent.</p>
              <div class="btn-row center">
                <a class="btn btn-primary btn-lg" [href]="login + 'CitizenLogin.aspx'" target="_blank" rel="noopener noreferrer">
                  <span>Continue to secure sign-in</span><i class="pi pi-external-link" aria-hidden="true"></i><span class="sr-only"> (opens in a new tab)</span>
                </a>
                <button type="button" class="btn btn-outline btn-lg" (click)="editDetails()">Edit details</button>
              </div>
            </div>
          }
        </article>

        <!-- ================= New user ================= -->
        <aside class="cl-side" aria-labelledby="cl-new-h">
          <div class="cl-card cl-new">
            <header class="cl-head">
              <span class="icon-tile lg accent" aria-hidden="true"><i class="pi pi-user-plus"></i></span>
              <div>
                <h2 id="cl-new-h">New User</h2>
                <p>Register with the Government of Gujarat online portal and get access to 100+ services.</p>
              </div>
            </header>
            <a class="btn btn-accent btn-block" [href]="login + 'CitizenRegistration.aspx'" target="_blank" rel="noopener">
              <i class="pi pi-user-plus" aria-hidden="true"></i> New Registration (Citizen)
              <i class="pi pi-external-link ext" aria-hidden="true"></i><span class="sr-only"> (opens in a new tab)</span>
            </a>
            <ul class="cl-perks">
              @for (p of perks; track p.text) { <li><span class="icon-tile" aria-hidden="true"><i [class]="p.icon"></i></span>{{ p.text }}</li> }
            </ul>
          </div>

          <div class="cl-help">
            <span class="icon-tile green" aria-hidden="true"><i class="pi pi-phone"></i></span>
            <p>Contact our common Service Portal Help-Line <a href="tel:18002335500">1800 233 5500</a> for further information.</p>
          </div>

          <div class="cl-manuals">
            <a [href]="login + 'Download/User_Manual_on_CSP_v1.1.pdf'" target="_blank" rel="noopener"><i class="pi pi-download" aria-hidden="true"></i> User Manual in English <small>(PDF)</small><i class="pi pi-external-link ext" aria-hidden="true"></i><span class="sr-only"> (opens in a new tab)</span></a>
            <a [href]="login + 'Download/GUser_Manual_on_CSP_v1.1.pdf'" target="_blank" rel="noopener"><i class="pi pi-download" aria-hidden="true"></i> User Manual in Gujarati <small>(PDF)</small><i class="pi pi-external-link ext" aria-hidden="true"></i><span class="sr-only"> (opens in a new tab)</span></a>
          </div>
        </aside>
      </div>
    </section>

    <!-- ================= Latest update ================= -->
    <section class="section alt" aria-labelledby="cl-news-h">
      <div class="container">
        <div class="section-head">
          <p class="eyebrow"><i class="pi pi-megaphone" aria-hidden="true"></i> Notices</p>
          <h2 id="cl-news-h">Latest Update</h2>
        </div>
        <ul class="cl-news">
          @for (n of news; track $index) {
            <li class="cl-news-item" [class.alert]="n.tone === 'alert'">
              <i class="pi" [class.pi-exclamation-circle]="n.tone === 'alert'" [class.pi-info-circle]="n.tone !== 'alert'" aria-hidden="true"></i>
              <p>
                @if (n.tone === 'alert') { <span class="badge new">Important</span> }
                {{ n.text }}
                @for (l of n.links ?? []; track l.url) {
                  <a [href]="l.url" target="_blank" rel="noopener">{{ l.label }}<i class="pi pi-external-link ext" aria-hidden="true"></i><span class="sr-only"> (opens in a new tab)</span></a>
                }
              </p>
            </li>
          }
        </ul>
      </div>
    </section>
  `,
})
export class CitizenLoginPage {
  readonly login = LOGIN_APP;

  readonly perks = [
    { icon: 'pi pi-send', text: 'Apply online' },
    { icon: 'pi pi-folder', text: 'Store documents in Digital Locker' },
    { icon: 'pi pi-credit-card', text: 'Pay online' },
    { icon: 'pi pi-clock', text: 'Track application status' },
  ];

  readonly news: NewsItem[] = [
    { tone: 'info', text: 'If you are unable to access scholarship services via Digital Gujarat, you can avail of them at', links: [{ label: 'gssp.gujarat.gov.in', url: 'https://gssp.gujarat.gov.in' }] },
    { tone: 'alert', text: 'Due to remaining students: for Academic Year 2026-27, filling Post Matric Scholarship forms on the Digital Gujarat portal for SC students remain re-open from 01/10/2026 to 31/10/2026.' },
    { tone: 'alert', text: 'Applications are invited online for the Post-Matric Scholarship and allied educational schemes for the academic year 2026-27 for Scheduled Tribe students from 01/09/2026 to 30/11/2026.' },
    { tone: 'alert', text: 'Applications are invited again for the Post-Matric Scholarship and allied educational schemes for the academic year 2025-26 for remaining Scheduled Tribe students from 01/10/2026 to 20/10/2026.' },
    {
      tone: 'info', text: 'Post Metric Scholarships guideline (2026-27):', links: [
        { label: 'SC students', url: encodeURI(DOWNLOADS + 'Guideline for SC Students (DGP) 2026-27.pdf') },
        { label: 'SEBC students', url: encodeURI(DOWNLOADS + 'DCW_Guidiline_26-27.pdf') },
        { label: 'ST students', url: encodeURI(DOWNLOADS + '2026-27 Guidelines Post-Matric.pdf') },
      ],
    },
    {
      tone: 'info', text: 'Use NIC’s SANDES messaging app to get alert / OTP SMSes related to your Digital Gujarat login instantly. Get it on', links: [
        { label: 'Android Play Store', url: 'https://play.google.com/store/apps/details?id=in.nic.gimkerala&hl=en_IN&gl=US' },
        { label: 'iOS App Store', url: 'https://apps.apple.com/in/app/sandes/id1517976582' },
      ],
    },
  ];

  // ---- form state ----
  stage = signal<'form' | 'handoff'>('form');
  idType = signal<IdType>('');
  username = signal('');
  userTouched = signal(false);
  password = signal('');
  showPw = signal(false);
  captchaInput = signal('');
  captchaTouched = signal(false);
  captchaCode = signal('');
  spinning = signal(false);

  private canvas = viewChild<ElementRef<HTMLCanvasElement>>('cap');

  userLabel = computed(() => (this.idType() === 'mobile' ? 'Mobile number' : this.idType() === 'citizen' ? 'Citizen ID' : 'User name'));
  userPlaceholder = computed(() => (this.idType() === 'mobile' ? '10-digit mobile number' : 'Your Citizen ID'));
  userOk = computed(() => {
    const u = this.username().trim();
    return this.idType() === 'mobile' ? /^[6-9]\d{9}$/.test(u) : this.idType() === 'citizen' ? /^[A-Za-z0-9]{4,30}$/.test(u) : false;
  });
  userError = computed(() => (this.idType() === 'mobile' ? 'Enter a valid 10-digit mobile number.' : 'Enter your Citizen ID (letters and numbers only).'));

  /** Live password policy. 'info' rules are enforced by the official portal and cannot be checked here. */
  rules = computed(() => {
    const p = this.password();
    const u = this.username().trim().toLowerCase();
    const started = p.length > 0;
    const st = (ok: boolean) => (!started ? 'idle' : ok ? 'pass' : 'fail') as 'idle' | 'pass' | 'fail';
    const lower = p.toLowerCase();
    const common = COMMON.some((w) => lower.includes(w)) || SEQUENCES.some((s) => p.includes(s));
    const hasId = u.length >= 4 && lower.includes(u);
    return [
      { id: 'len', text: 'Between 8 and 20 characters', state: st(p.length >= 8 && p.length <= 20) },
      { id: 'up', text: 'At least one uppercase letter', state: st(/[A-Z]/.test(p)) },
      { id: 'lo', text: 'At least one lowercase letter', state: st(/[a-z]/.test(p)) },
      { id: 'num', text: 'At least one number', state: st(/\d/.test(p)) },
      { id: 'sp', text: 'At least one special character from @ # ? $', state: st(/[@#?$]/.test(p)) },
      { id: 'id', text: 'Does not contain your email id / mobile number', state: st(!hasId) },
      { id: 'cm', text: 'Not a common password (e.g. abc@123 or xyz@789)', state: st(!common) },
      { id: 'hist', text: 'Different from your last three passwords (checked on the official portal)', state: 'info' as const },
    ];
  });
  private required = computed(() => this.rules().filter((r) => r.state !== 'info'));
  strength = computed(() => {
    if (!this.password()) return 0;
    const r = this.required();
    return Math.round((r.filter((x) => x.state === 'pass').length / r.length) * 100);
  });
  strengthLevel = computed(() => (this.strength() === 100 ? 'strong' : this.strength() >= 70 ? 'good' : this.strength() >= 40 ? 'fair' : 'weak'));
  policyOk = computed(() => this.password().length > 0 && this.required().every((r) => r.state === 'pass'));

  captchaOk = computed(() => this.captchaInput().trim().toUpperCase() === this.captchaCode() && this.captchaCode() !== '');
  canLogin = computed(() => !!this.idType() && this.userOk() && this.policyOk() && this.captchaOk());
  todo = computed(() => {
    const t: string[] = [];
    if (!this.idType()) t.push('choose a login type');
    else if (!this.userOk()) t.push(this.idType() === 'mobile' ? 'a valid mobile number' : 'your Citizen ID');
    if (!this.policyOk()) t.push('a password that meets the policy');
    if (!this.captchaOk()) t.push('the captcha');
    return t.join(', ');
  });

  constructor() {
    afterNextRender(() => this.refreshCaptcha());
  }

  setType(v: string) { this.idType.set(v as IdType); this.username.set(''); this.userTouched.set(false); }
  setUser(v: string) { this.username.set(this.idType() === 'mobile' ? v.replace(/\D/g, '').slice(0, 10) : v.replace(/\s/g, '')); }

  submit(e: Event) {
    e.preventDefault();
    this.userTouched.set(true);
    this.captchaTouched.set(true);
    if (!this.canLogin()) return;
    this.password.set(''); // never keep the typed password around
    this.stage.set('handoff');
  }

  editDetails() {
    this.stage.set('form');
    this.captchaInput.set('');
    setTimeout(() => this.refreshCaptcha());
  }

  refreshCaptcha() {
    this.spinning.set(true);
    setTimeout(() => this.spinning.set(false), 600);
    const rnd = crypto.getRandomValues(new Uint32Array(5));
    const code = Array.from(rnd, (n) => CAPTCHA_CHARS[n % CAPTCHA_CHARS.length]).join('');
    this.captchaCode.set(code);
    this.captchaInput.set('');
    this.captchaTouched.set(false);
    this.draw(code);
  }

  private draw(code: string) {
    const c = this.canvas()?.nativeElement;
    const ctx = c?.getContext('2d');
    if (!c || !ctx) return;
    const { width: w, height: h } = c;
    ctx.clearRect(0, 0, w, h);
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, '#eef3fb'); bg.addColorStop(1, '#fbf3e4');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
    const r = (a: number, b: number) => a + Math.random() * (b - a);
    ctx.lineWidth = 1.4;
    for (let i = 0; i < 6; i++) { ctx.strokeStyle = `rgba(26,74,148,${r(0.2, 0.5)})`; ctx.beginPath(); ctx.moveTo(r(0, w), r(0, h)); ctx.bezierCurveTo(r(0, w), r(0, h), r(0, w), r(0, h), r(0, w), r(0, h)); ctx.stroke(); }
    for (let i = 0; i < 40; i++) { ctx.fillStyle = `rgba(154,90,5,${r(0.15, 0.45)})`; ctx.fillRect(r(0, w), r(0, h), 2, 2); }
    const colors = ['#13336b', '#1a4a94', '#2f6bc4', '#9a5a05'];
    [...code].forEach((ch, i) => {
      ctx.save();
      ctx.translate(18 + i * 26, h / 2 + r(-3, 3));
      ctx.rotate(r(-0.35, 0.35));
      ctx.font = `700 ${Math.round(r(26, 31))}px 'Noto Sans', Arial, sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = colors[i % colors.length];
      ctx.fillText(ch, 0, 0);
      ctx.restore();
    });
  }
}
