import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHero } from '../shared/page-hero';

/** GIGW: Screen Reader Access page — lists screen readers that work with this site and the site's own accessibility aids. */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-screen-reader',
  imports: [RouterLink, PageHero],
  template: `
    <app-page-hero title="Screen Reader Access" subtitle="Use Digital Gujarat with the assistive technology you prefer." />
    <section class="section scr-page" data-main tabindex="-1">
      <div class="container scr-layout">
        <div class="scr-main">
          <div class="scr-intro">
            <p class="scr-lead">
              Digital Gujarat complies with the <strong>Guidelines for Indian Government Websites (GIGW 3.0)</strong> and
              <strong>WCAG 2.1 level AA</strong> of the World Wide Web Consortium. This lets people with visual impairments
              use the website with assistive technologies such as screen readers.
            </p>
            <p class="muted">
              Content is structured with proper headings, labelled form fields, text alternatives for images and keyboard-operable controls.
              The screen readers below are known to work with this site.
            </p>
          </div>

          <h2 class="scr-h2" id="scr-table-title">Screen readers</h2>
          <div class="scr-table-wrap" role="region" aria-labelledby="scr-table-title" tabindex="0">
            <table class="scr-table">
              <caption class="sr-only">Screen readers, their websites and whether they are free or commercial</caption>
              <thead>
                <tr><th scope="col">Screen reader</th><th scope="col">Website</th><th scope="col">Free / Commercial</th></tr>
              </thead>
              <tbody>
                @for (r of readers; track r.name) {
                  <tr>
                    <th scope="row">
                      <span class="scr-name">{{ r.name }}</span>
                      <span class="scr-platform">{{ r.platform }}</span>
                    </th>
                    <td>
                      @if (r.url) {
                        <a [href]="r.url" target="_blank" rel="noopener">{{ r.site }}<i class="pi pi-external-link ext" aria-hidden="true"></i><span class="sr-only"> (opens in a new tab)</span></a>
                      } @else { <span>{{ r.site }}</span> }
                    </td>
                    <td><span class="badge" [class.success]="r.cost !== 'Commercial'" [class.accent]="r.cost === 'Commercial'">{{ r.cost }}</span></td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <aside class="scr-side" aria-labelledby="scr-feat-title">
          <div class="card scr-feat">
            <h2 class="scr-h2" id="scr-feat-title">Accessibility features on this site</h2>
            <ul class="scr-feat-list" role="list">
              @for (f of features; track f.title) {
                <li>
                  <span class="icon-tile" aria-hidden="true"><i [class]="f.icon"></i></span>
                  <span><b>{{ f.title }}</b><span class="muted">{{ f.text }}</span></span>
                </li>
              }
            </ul>
            <a class="more" routerLink="/accessibility-statement">Read the accessibility statement <i class="pi pi-arrow-right" aria-hidden="true"></i></a>
          </div>
        </aside>
      </div>
    </section>
  `,
})
export class ScreenReaderPage {
  readers = [
    { name: 'NVDA (Non Visual Desktop Access)', platform: 'Windows', site: 'www.nvaccess.org', url: 'https://www.nvaccess.org/', cost: 'Free' },
    { name: 'JAWS', platform: 'Windows', site: 'www.freedomscientific.com', url: 'https://www.freedomscientific.com/products/software/jaws/', cost: 'Commercial' },
    { name: 'Windows Narrator', platform: 'Windows', site: 'Built into Windows', url: '', cost: 'Free (built in)' },
    { name: 'VoiceOver', platform: 'macOS, iOS and iPadOS', site: 'Built into Apple devices', url: '', cost: 'Free (built in)' },
    { name: 'TalkBack', platform: 'Android', site: 'Built into Android', url: '', cost: 'Free (built in)' },
    { name: 'Orca', platform: 'Linux (GNOME)', site: 'orca.gnome.org', url: 'https://orca.gnome.org/', cost: 'Free' },
  ];
  features = [
    { icon: 'pi pi-sort-alpha-up', title: 'Text size A- / A / A+', text: 'Make text smaller or larger from the top bar.' },
    { icon: 'pi pi-sun', title: 'Contrast switcher', text: 'Choose standard, dark or high-contrast colours.' },
    { icon: 'pi pi-forward', title: 'Skip to main content', text: 'Press Tab on any page to jump past the menus.' },
    { icon: 'pi pi-cog', title: 'Accessibility panel (Ctrl+F2)', text: 'More reading and display options in one place.' },
    { icon: 'pi pi-arrows-alt', title: 'Keyboard navigation', text: 'Every link, menu and control works with Tab, Enter and arrow keys, with a visible focus outline.' },
  ];
}
