import { items } from '@wix/data';
import { window as wixWindow } from '@wix/site-window';
import styles from './members-directory.module.css';

const DEFAULT_COLLECTION = '@jameslaymusic/membership-directory/members';

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
        <h2 class="${styles.heading}">Our Members</h2>
        <div id="directory-content">
          <div class="${styles.loading}">Loading members...</div>
        </div>
      </div>
    `;
  }

  async fetchMembers() {
    const collectionId = this.getAttribute('collection-id') || DEFAULT_COLLECTION;
    console.log('[Members Directory] querying collection:', collectionId);

    try {
      const result = await items.query(collectionId)
        .eq('published', true)
        .descending('_createdDate')
        .find();

      const container = this.querySelector('#directory-content')!;
      const members = result.items as Member[];
      console.log('[Members Directory] found:', members.length, 'items');

      if (members.length === 0) {
        container.innerHTML = `<div class="${styles.empty}">No members yet.</div>`;
        return;
      }

      container.innerHTML = `
        <div class="${styles.grid}">
          ${members.map(m => this.renderCard(m)).join('')}
        </div>
      `;
    } catch (error: any) {
      console.error('[Members Directory] query failed:', error.message);
      const container = this.querySelector('#directory-content')!;
      container.innerHTML = `<div class="${styles.empty}">Failed to load members.</div>`;
    }
  }

  renderCard(member: Member): string {
    const initials = (member.name || '?').charAt(0).toUpperCase();
    const displayName = member.businessName || member.organizationName || [member.name, member.lastName].filter(Boolean).join(' ') || 'Member';
    const categories = member.categories ? member.categories.split(',').map(c => c.trim()) : [];

    return `
      <div class="${styles.card}">
        ${member.photo
          ? `<img class="${styles.photo}" src="${this.esc(member.photo)}" alt="${this.esc(displayName)}" />`
          : `<div class="${styles.photoPlaceholder}">${initials}</div>`
        }
        <h3 class="${styles.cardName}">${this.esc(displayName)}</h3>
        ${member.listingTitle ? `<p class="${styles.cardTitle}">${this.esc(member.listingTitle)}</p>` : ''}
        ${member.pronouns ? `<p class="${styles.cardPronouns}">${this.esc(member.pronouns)}</p>` : ''}
        ${categories.length > 0 ? `
          <div class="${styles.categories}">
            ${categories.map(c => `<span class="${styles.categoryTag}">${this.esc(c)}</span>`).join('')}
          </div>
        ` : ''}
        ${member.bio ? `<p class="${styles.cardBio}">${this.esc(member.bio)}</p>` : ''}
        <div class="${styles.contactLinks}">
          ${member.email ? `<a href="mailto:${this.esc(member.email)}" class="${styles.link}">Email</a>` : ''}
          ${member.website ? `<a href="${this.esc(member.website)}" target="_blank" rel="noopener" class="${styles.link}">Website</a>` : ''}
          ${member.phone ? `<span class="${styles.link}">${this.esc(member.phone)}</span>` : ''}
        </div>
        <div class="${styles.socialLinks}">
          ${member.facebook ? `<a href="${this.esc(member.facebook)}" target="_blank" rel="noopener" class="${styles.socialLink}" title="Facebook">FB</a>` : ''}
          ${member.instagram ? `<a href="${this.esc(member.instagram)}" target="_blank" rel="noopener" class="${styles.socialLink}" title="Instagram">IG</a>` : ''}
          ${member.linkedin ? `<a href="${this.esc(member.linkedin)}" target="_blank" rel="noopener" class="${styles.socialLink}" title="LinkedIn">LI</a>` : ''}
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
