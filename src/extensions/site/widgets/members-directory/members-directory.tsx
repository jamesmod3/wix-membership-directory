import { items } from '@wix/data';
import { window as wixWindow } from '@wix/site-window';
import styles from './members-directory.module.css';

import { DIRECTORY_COLLECTION_ID as DEFAULT_COLLECTION } from '../../../shared/constants';

interface Member {
  _id: string
  planType?: string
  organizationName?: string
  name?: string
  lastName?: string
  pronouns?: string
  email?: string
  phone?: string
  address?: string
  categories?: string
  listingTitle?: string
  bio?: string
  website?: string
  facebook?: string
  instagram?: string
  linkedin?: string
  photo?: string
  businessName?: string
}

class MembersDirectory extends HTMLElement {
  static get observedAttributes() {
    return ['collection-id'];
  }

  private allMembers: Member[] = [];

  constructor() {
    super();
  }

  async connectedCallback() {
    const viewMode = await wixWindow.viewMode();
    console.log('[Members Directory] viewMode:', viewMode);

    if (viewMode === 'Editor') {
      this.renderEditorPlaceholder();
      return;
    }

    this.render();
    await this.fetchMembers();
  }

  attributeChangedCallback() {
  }

  renderEditorPlaceholder() {
    this.innerHTML = `
      <div style="padding:40px;border:2px dashed #ccc;border-radius:8px;text-align:center;color:#999;font-family:sans-serif;">
        <h3 style="margin:0 0 8px;">Members Directory</h3>
        <p style="margin:0;font-size:14px;">Published member profiles will display here on the live site.</p>
      </div>
    `;
  }

  render() {
    this.innerHTML = `
      <div class="${styles.root}">
        <h2 class="${styles.heading}">NMDN Directory</h2>
        <p class="${styles.subtitle}">Connecting you with end-of-life care providers in New Mexico</p>
        <div class="${styles.searchArea}">
          <div class="${styles.searchRow}">
            <input type="text" id="directory-search" class="${styles.searchInput}" placeholder="Search by name, organization, or keyword..." />
            <select id="directory-category" class="${styles.categorySelect}">
              <option value="">All Categories</option>
            </select>
          </div>
        </div>
        <div id="directory-content">
          <div class="${styles.loading}">Loading members...</div>
        </div>
      </div>
    `;

    const searchInput = this.querySelector('#directory-search') as HTMLInputElement;
    const categorySelect = this.querySelector('#directory-category') as HTMLSelectElement;

    searchInput.addEventListener('input', () => this.filterMembers());
    categorySelect.addEventListener('change', () => this.filterMembers());
  }

  async fetchMembers() {
    const collectionId = this.getAttribute('collection-id') || DEFAULT_COLLECTION;
    console.log('[Members Directory] querying collection:', collectionId);

    try {
      const result = await items.query(collectionId)
        .eq('published', true)
        .descending('_createdDate')
        .find();

      this.allMembers = result.items as Member[];
      console.log('[Members Directory] found:', this.allMembers.length, 'items');

      this.populateCategoryFilter();
      this.filterMembers();
    } catch (error: any) {
      console.error('[Members Directory] query failed:', error.message);
      const container = this.querySelector('#directory-content')!;
      container.innerHTML = `<div class="${styles.empty}">Failed to load members.</div>`;
    }
  }

  populateCategoryFilter() {
    const categorySet = new Set<string>();
    for (const m of this.allMembers) {
      if (m.categories) {
        for (const c of m.categories.split(',').map(s => s.trim())) {
          if (c) categorySet.add(c);
        }
      }
    }
    const select = this.querySelector('#directory-category') as HTMLSelectElement;
    const sorted = [...categorySet].sort();
    for (const cat of sorted) {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat;
      select.appendChild(opt);
    }
  }

  filterMembers() {
    const searchInput = this.querySelector('#directory-search') as HTMLInputElement;
    const categorySelect = this.querySelector('#directory-category') as HTMLSelectElement;
    const query = searchInput.value.toLowerCase().trim();
    const categoryFilter = categorySelect.value;

    const filtered = this.allMembers.filter(m => {
      if (categoryFilter) {
        const cats = (m.categories || '').split(',').map(s => s.trim());
        if (!cats.includes(categoryFilter)) return false;
      }
      if (query) {
        const haystack = [
          m.businessName, m.organizationName, m.name, m.lastName,
          m.listingTitle, m.bio, m.email, m.phone, m.address,
        ].filter(Boolean).join(' ').toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });

    this.renderMembers(filtered);
  }

  renderMembers(members: Member[]) {
    const container = this.querySelector('#directory-content')!;
    const resultCount = this.querySelector('.result-count');

    if (members.length === 0) {
      container.innerHTML = `
        <div class="${styles.resultCount}">No members match your search.</div>
        <div class="${styles.empty}">Try adjusting your filters.</div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="${styles.resultCount}">${members.length} member${members.length === 1 ? '' : 's'}</div>
      <div class="${styles.grid}">
        ${members.map(m => this.renderCard(m)).join('')}
      </div>
    `;
  }

  renderCard(member: Member): string {
    const initials = ((member.name || '?')[0] + (member.lastName || '')[0]).toUpperCase() || '?';
    const displayName = member.organizationName || member.businessName || [member.name, member.lastName].filter(Boolean).join(' ') || 'Member';
    const categories = member.categories ? member.categories.split(',').map(c => c.trim()) : [];

    return `
      <div class="${styles.card}">
        <div class="${styles.cardHeader}">
          ${member.photo
            ? `<img class="${styles.photo}" src="${this.esc(member.photo)}" alt="${this.esc(displayName)}" />`
            : `<div class="${styles.photoPlaceholder}">${initials}</div>`
          }
          <div class="${styles.cardTitleGroup}">
            <h3 class="${styles.cardName}">${this.esc(displayName)}</h3>
            ${member.listingTitle ? `<p class="${styles.cardListingTitle}">${this.esc(member.listingTitle)}</p>` : ''}
            ${member.pronouns ? `<p class="${styles.cardPronouns}">${this.esc(member.pronouns)}</p>` : ''}
          </div>
        </div>
        ${categories.length > 0 ? `
          <div class="${styles.categories}">
            ${categories.map(c => `<span class="${styles.categoryTag}">${this.esc(c)}</span>`).join('')}
          </div>
        ` : ''}
        ${member.bio ? `<p class="${styles.cardBio}">${this.esc(member.bio)}</p>` : ''}
        <div class="${styles.contactLinks}">
          ${member.phone ? `<a href="tel:${this.esc(member.phone.replace(/[^0-9+]/g, ''))}" class="${styles.contactLink}"><span class="${styles.contactLinkIcon}">📞</span> ${this.esc(member.phone)}</a>` : ''}
          ${member.email ? `<a href="mailto:${this.esc(member.email)}" class="${styles.contactLink}"><span class="${styles.contactLinkIcon}">✉</span> ${this.esc(member.email)}</a>` : ''}
          ${member.website ? `<a href="${this.esc(member.website)}" target="_blank" rel="noopener" class="${styles.contactLink}"><span class="${styles.contactLinkIcon}">→</span> ${this.esc(new URL(member.website).hostname.replace('www.', ''))}</a>` : ''}
        </div>
        <div class="${styles.socialLinks}">
          ${member.facebook ? `<a href="${this.esc(member.facebook)}" target="_blank" rel="noopener" class="${styles.socialLink}">Facebook</a>` : ''}
          ${member.instagram ? `<a href="${this.esc(member.instagram)}" target="_blank" rel="noopener" class="${styles.socialLink}">Instagram</a>` : ''}
          ${member.linkedin ? `<a href="${this.esc(member.linkedin)}" target="_blank" rel="noopener" class="${styles.socialLink}">LinkedIn</a>` : ''}
        </div>
      </div>
    `;
  }

  esc(str: string): string {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
}

export default MembersDirectory;
