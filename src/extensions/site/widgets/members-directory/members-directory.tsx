import { items } from '@wix/data';
import { window as wixWindow } from '@wix/site-window';
import styles from './members-directory.module.css';

const COLLECTION_ID = '@jameslaymusic/membership-directory/members';

interface Member {
  _id: string
  name?: string
  title?: string
  bio?: string
  photo?: string
  email?: string
  phone?: string
  website?: string
  socialLinks?: string
  businessName?: string
}

class MembersDirectory extends HTMLElement {
  static get observedAttributes() {
    return [];
  }

  constructor() {
    super();
  }

  async connectedCallback() {
    const viewMode = await wixWindow.viewMode();

    if (viewMode === 'Editor') {
      this.renderEditorPlaceholder();
      return;
    }

    this.render();
    await this.fetchMembers();
  }

  attributeChangedCallback() {}

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
    try {
      const result = await items.query(COLLECTION_ID)
        .eq('published', true)
        .descending('_createdDate')
        .find();

      const container = this.querySelector('#directory-content')!;
      const members = result.items as Member[];

      if (members.length === 0) {
        container.innerHTML = `<div class="${styles.empty}">No members yet.</div>`;
        return;
      }

      container.innerHTML = `
        <div class="${styles.grid}">
          ${members.map(m => this.renderCard(m)).join('')}
        </div>
      `;
    } catch (error) {
      console.error('Failed to load members:', error);
      const container = this.querySelector('#directory-content')!;
      container.innerHTML = `<div class="${styles.empty}">Failed to load members.</div>`;
    }
  }

  renderCard(member: Member): string {
    const initials = (member.name || '?').charAt(0).toUpperCase();

    return `
      <div class="${styles.card}">
        ${member.photo
          ? `<img class="${styles.photo}" src="${this.esc(member.photo)}" alt="${this.esc(member.name || '')}" />`
          : `<div class="${styles.photoPlaceholder}">${initials}</div>`
        }
        <h3 class="${styles.cardName}">${this.esc(member.name || '')}</h3>
        ${member.title ? `<p class="${styles.cardTitle}">${this.esc(member.title)}</p>` : ''}
        ${member.bio ? `<p class="${styles.cardBio}">${this.esc(member.bio)}</p>` : ''}
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
