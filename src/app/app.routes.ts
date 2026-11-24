import { Routes } from '@angular/router';

const policy = (key: { path: string; key: string }, title: string) => ({
  path: key.path,
  loadComponent: () => import('./pages/policy').then((m) => m.PolicyPage),
  data: { key: key.key, title },
  title: `${title} | Digital Gujarat`,
});

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home').then((m) => m.HomePage), title: 'Digital Gujarat – Government Services, One Platform' },
  { path: 'citizen-login', loadComponent: () => import('./pages/citizen-login').then((m) => m.CitizenLoginPage), title: 'Citizen Login | Digital Gujarat' },
  { path: 'about-us', loadComponent: () => import('./pages/about').then((m) => m.AboutPage), title: 'About Us | Digital Gujarat' },
  { path: 'sugam-digital-gujarat', loadComponent: () => import('./pages/service-list').then((m) => m.ServiceListPage), data: { key: 'sugam' }, title: 'Sugam Digital Gujarat | Digital Gujarat' },
  { path: 'services/citizen', loadComponent: () => import('./pages/service-list').then((m) => m.ServiceListPage), data: { key: 'citizen' }, title: 'Citizen Services | Digital Gujarat' },
  { path: 'services/digital-sevasetu', loadComponent: () => import('./pages/service-list').then((m) => m.ServiceListPage), data: { key: 'dss' }, title: 'Digital SevaSetu Services | Digital Gujarat' },
  { path: 'services/janseva', loadComponent: () => import('./pages/service-list').then((m) => m.ServiceListPage), data: { key: 'janseva' }, title: 'Janseva Services | Digital Gujarat' },
  { path: 'services/linked', loadComponent: () => import('./pages/linked-services').then((m) => m.LinkedServicesPage), title: 'Linked Services | Digital Gujarat' },
  { path: 'latest-update', loadComponent: () => import('./pages/latest-update').then((m) => m.LatestUpdatePage), title: 'Latest Update | Digital Gujarat' },
  { path: 'faq', loadComponent: () => import('./pages/faq').then((m) => m.FaqPage), title: 'FAQ | Digital Gujarat' },
  { path: 'sitemap', loadComponent: () => import('./pages/sitemap').then((m) => m.SitemapPage), title: 'Site Map | Digital Gujarat' },
  { path: 'feedback', loadComponent: () => import('./pages/feedback').then((m) => m.FeedbackPage), title: 'Feedback | Digital Gujarat' },
  { path: 'feedback-dashboard', loadComponent: () => import('./pages/feedback-dashboard').then((m) => m.FeedbackDashboardPage), title: 'Feedback Response | Digital Gujarat' },
  { path: 'help-desk', loadComponent: () => import('./pages/help-desk').then((m) => m.HelpDeskPage), title: 'Helpdesk Support | Digital Gujarat' },
  { path: 'videos', loadComponent: () => import('./pages/videos').then((m) => m.VideosPage), title: 'Videos | Digital Gujarat' },
  { path: 'promotional-campaign', loadComponent: () => import('./pages/campaign').then((m) => m.CampaignPage), title: 'Promotional Campaign | Digital Gujarat' },
  { path: 'screen-reader-access', loadComponent: () => import('./pages/screen-reader').then((m) => m.ScreenReaderPage), title: 'Screen Reader Access | Digital Gujarat' },
  { path: 'user-manual', loadComponent: () => import('./pages/user-manual').then((m) => m.UserManualPage), title: 'Sugam User Manual | Digital Gujarat' },
  policy({ path: 'terms-conditions', key: 'terms' }, 'Terms & Conditions'),
  policy({ path: 'privacy-policy', key: 'privacy' }, 'Privacy Policy'),
  policy({ path: 'copyright-policy', key: 'copyright' }, 'Copyright Policy'),
  policy({ path: 'disclaimer', key: 'disclaimer' }, 'Disclaimer'),
  policy({ path: 'hyperlinking-policy', key: 'hyperlink' }, 'Hyperlinking Policy'),
  policy({ path: 'accessibility-statement', key: 'accessibility' }, 'Accessibility Statement'),
  { path: '**', loadComponent: () => import('./pages/not-found').then((m) => m.NotFoundPage), title: 'Page not found | Digital Gujarat' },
];
