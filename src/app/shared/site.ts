import { MenuItem } from 'primeng/api';

export const SITE = 'https://www.digitalgujarat.gov.in/';
export const A = 'assets/';
/** Images mirrored from the old site live under assets/site/. */
export const IMG = A + 'site/';

/** Menu items that leave the site (have a url) open in a new tab, recursively. */
function openExternal(items: MenuItem[]): MenuItem[] {
  return items.map((i) => ({ ...i, ...(i.url ? { target: '_blank' } : {}), ...(i.items ? { items: openExternal(i.items as MenuItem[]) } : {}) }));
}

export interface SiteLink { label: string; route?: string; url?: string; }

/** GIGW: every page shows when its content was last reviewed, and who owns / hosts it. */
export const LAST_UPDATED = '24 November 2026';
export const HELPLINE = { label: '1800 233 5500', tel: '18002335500' };
export const SUPPORT_EMAIL = 'dss-support@gujarat.gov.in';
export const OWNER = 'Department of Science & Technology, Government of Gujarat';

export const NAV: MenuItem[] = openExternal([
  { label: 'Home', icon: 'pi pi-home', routerLink: '/', routerLinkActiveOptions: { exact: true } },
  { label: 'About Us', routerLink: '/about-us' },
  { label: 'Sugam Digital Gujarat', routerLink: '/sugam-digital-gujarat' },
  {
    label: 'Services',
    items: [
      { label: 'Citizen Services', icon: 'pi pi-users', routerLink: '/services/citizen' },
      { label: 'Digital SevaSetu Services', icon: 'pi pi-bolt', routerLink: '/services/digital-sevasetu' },
      { label: 'Janseva Services', icon: 'pi pi-building', routerLink: '/services/janseva' },
      { label: 'Scholarship Services', icon: 'pi pi-graduation-cap', url: 'https://gssp.gujarat.gov.in/' },
      { label: 'Linked Services', icon: 'pi pi-link', routerLink: '/services/linked' },
    ],
  },
  { label: 'Policy', url: 'https://gujaratindia.gov.in/PolicyDetails' },
  { label: 'Business', url: 'https://gujaratindia.gov.in/Home/GujaratTheInvestmentDestination' },
  { label: 'Latest Update', routerLink: '/latest-update' },
  { label: 'Help Desk', routerLink: '/help-desk' },
]);

export const LOGIN_MENU: MenuItem[] = openExternal([
  { label: 'Citizen Login', icon: 'pi pi-user', routerLink: '/citizen-login' },
  { label: 'Office Login', icon: 'pi pi-building', url: 'https://sso.gujarat.gov.in/SSO.aspx?Rurl=https://www.digitalgujarat.gov.in/OfficeApp/frmMain.aspx' },
  { label: 'School / Institution Login', icon: 'pi pi-graduation-cap', url: 'https://gssp.gujarat.gov.in/LoginApp/SJEDLogin.aspx' },
]);

export const QUICK_LINKS: SiteLink[] = [
  { label: 'Gujarat At A Glance', url: 'https://gujaratindia.gov.in/Home/GujaratAtAGlance' },
  { label: 'Gujarat History', url: 'https://gujaratindia.gov.in/Index' },
  { label: 'Getting to Gujarat', url: 'https://gujaratindia.gov.in/Home/Getting-to-Gujarat' },
  { label: 'FAQ', route: '/faq' },
  { label: 'Site Map', route: '/sitemap' },
  { label: 'Feedback', route: '/feedback' },
  { label: 'Write to Grievance (Swagat)', url: 'https://swagat.gujarat.gov.in/' },
  { label: 'Collectors', url: 'https://revenuedepartment.gujarat.gov.in/collectorate' },
];

export const IMPORTANT_LINKS: SiteLink[] = [
  { label: 'Videos', route: '/videos' },
  { label: 'Sugam User Manual', route: '/user-manual' },
  { label: 'Feedback Response', route: '/feedback-dashboard' },
  { label: 'Promotional Campaign', route: '/promotional-campaign' },
  { label: 'Help Desk', route: '/help-desk' },
  { label: 'Screen Reader Access', route: '/screen-reader-access' },
];

/** GIGW mandatory footer links (policies, help, contact, sitemap, feedback). */
export const POLICY_LINKS: SiteLink[] = [
  { label: 'Terms & Conditions', route: '/terms-conditions' },
  { label: 'Privacy Policy', route: '/privacy-policy' },
  { label: 'Copyright Policy', route: '/copyright-policy' },
  { label: 'Hyperlinking Policy', route: '/hyperlinking-policy' },
  { label: 'Disclaimer', route: '/disclaimer' },
  { label: 'Accessibility Statement', route: '/accessibility-statement' },
  { label: 'Help', route: '/help-desk' },
  { label: 'Contact Us', route: '/help-desk' },
  { label: 'Feedback', route: '/feedback' },
  { label: 'Site Map', route: '/sitemap' },
];

export const SOCIAL = [
  { icon: 'pi pi-facebook', label: 'Facebook', url: 'https://www.facebook.com/sugamdigitalgujarat' },
  { icon: 'pi pi-instagram', label: 'Instagram', url: 'https://www.instagram.com/sugamdigitalgujarat' },
  { icon: 'pi pi-youtube', label: 'YouTube', url: 'https://www.youtube.com/@digitalgujarat-dit' },
];

/** Turn a relative link scraped from the old site into an absolute one. */
export function abs(u: string): string {
  if (!u) return '';
  if (/^https?:/i.test(u)) return u;
  return SITE + u.replace(/^\.\.\//, '').replace(/^\//, '').replace(/ /g, '%20');
}

const ROUTES: Record<string, string> = {
  'AboutUs.aspx': '/about-us',
  'SugamDGAbhiyanServices.aspx': '/sugam-digital-gujarat',
  'CitizenServices.aspx': '/services/citizen',
  'DSSServices.aspx': '/services/digital-sevasetu',
  'JansevaServices.aspx': '/services/janseva',
  'NesdaServices.aspx': '/services/linked',
  'LatestUpdate.aspx': '/latest-update',
  'FAQ.aspx': '/faq',
  'Sitemap.aspx': '/sitemap',
  'Feedback.aspx': '/feedback',
  'FeedbackDashboard.aspx': '/feedback-dashboard',
  'HelpDesk.aspx': '/help-desk',
  'Videos.aspx': '/videos',
  'Campaign.aspx': '/promotional-campaign',
  'SugamUserManual.aspx': '/user-manual',
  'TermsCondition.aspx': '/terms-conditions',
  'PrivacyPolicy.aspx': '/privacy-policy',
  'CopyrightPolicy.aspx': '/copyright-policy',
  'Disclaimer.aspx': '/disclaimer',
  'HyperlinkPolicy.aspx': '/hyperlinking-policy',
  'AccessibilityStatement.aspx': '/accessibility-statement',
  'HomePage.aspx': '/',
  'CitizenLogin.aspx': '/citizen-login',
  'index.html': '/',
};

/** Map a link from the old site onto the matching route of this app, if there is one. */
export function routeFor(u: string): string | null {
  if (/^https?:/i.test(u) && !u.startsWith(SITE)) return null;
  const file = u.split(/[?#]/)[0].split('/').pop() ?? '';
  return ROUTES[file] ?? null;
}
