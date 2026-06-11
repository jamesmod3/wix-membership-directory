import { window as wixWindow } from '@wix/site-window';
import { members } from '@wix/members';
import { createDataStore, type DataStore } from './data-store';
import styles from './member-profile-form.module.css';

class MemberProfileForm extends HTMLElement {
  static get observedAttributes() {
    return [];
  }

  private store: DataStore | null = null;
  private memberId: string | null = null;
  private existingItemId: string | null = null;

  constructor() {
    super();
  }

  async connectedCallback() {
    const viewMode = await wixWindow.viewMode();
    this.store = createDataStore(viewMode === 'Editor');

    if (viewMode === 'Editor') {
      this.renderEditorPlaceholder();
      return;
    }

    try {
      const response = await members.getCurrentMember();
      this.memberId = response.member?._id ?? null;
    } catch (e) {
      console.error('[Member Profile] Failed to get member ID:', e);
    }

    if (!this.memberId) {
      this.renderForm(null);
      return;
    }

    try {
      const result = await this.store.queryByMemberId(this.memberId);
      if (result.items.length > 0) {
        const item = result.items[0];
        this.existingItemId = item._id;
        this.renderForm(item);
      } else {
        this.renderForm(null);
      }
    } catch {
      this.renderForm(null);
    }
  }

  attributeChangedCallback() {}

  renderEditorPlaceholder() {
    this.innerHTML = `
      <div style="padding:40px;border:2px dashed #ccc;border-radius:8px;text-align:center;color:#999;font-family:sans-serif;">
        <h3 style="margin:0 0 8px;">Member Profile Form</h3>
        <p style="margin:0;font-size:14px;">Members will fill out their profile here on the live site.</p>
      </div>
    `;
  }

  renderForm(data: any | null) {
    const isEdit = !!data;
    this.innerHTML = `
      <div class="${styles.root}">
        <h2 class="${styles.heading}">${isEdit ? 'Edit Your Profile' : 'Create Your Member Profile'}</h2>
        <form id="member-form" class="${styles.form}">
          <label class="${styles.label}">
            Business Name
            <input type="text" name="businessName" value="${this.esc(data?.businessName || '')}" class="${styles.input}" placeholder="Your business or organization name" />
          </label>
          <label class="${styles.label}">
            Full Name <span class="${styles.required}">*</span>
            <input type="text" name="name" value="${this.esc(data?.name || '')}" required class="${styles.input}" />
          </label>
          <label class="${styles.label}">
            Title / Role
            <input type="text" name="title" value="${this.esc(data?.title || '')}" class="${styles.input}" placeholder="e.g. Board Member, Volunteer" />
          </label>
          <label class="${styles.label}">
            Biography
            <textarea name="bio" rows="4" class="${styles.textarea}">${this.esc(data?.bio || '')}</textarea>
          </label>
          <label class="${styles.label}">
            Photo URL
            <input type="url" name="photo" value="${this.esc(data?.photo || '')}" class="${styles.input}" placeholder="https://example.com/photo.jpg" />
          </label>
          <label class="${styles.label}">
            Email
            <input type="email" name="email" value="${this.esc(data?.email || '')}" class="${styles.input}" />
          </label>
          <label class="${styles.label}">
            Phone
            <input type="tel" name="phone" value="${this.esc(data?.phone || '')}" class="${styles.input}" />
          </label>
          <label class="${styles.label}">
            Website
            <input type="url" name="website" value="${this.esc(data?.website || '')}" class="${styles.input}" />
          </label>
          <label class="${styles.label}">
            Social Links (one per line)
            <textarea name="socialLinks" rows="3" class="${styles.textarea}" placeholder="https://facebook.com/your-profile&#10;https://instagram.com/your-profile">${this.esc(data?.socialLinks || '')}</textarea>
          </label>
          <button type="submit" class="${styles.button}">${isEdit ? 'Update Profile' : 'Submit Profile'}</button>
        </form>
        <div id="form-message" class="${styles.message}"></div>
      </div>
    `;

    this.querySelector('#member-form')!.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  async handleSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const profileData: Record<string, any> = {
      memberId: this.memberId,
      businessName: (formData.get('businessName') as string).trim(),
      name: (formData.get('name') as string).trim(),
      title: (formData.get('title') as string).trim(),
      bio: (formData.get('bio') as string).trim(),
      photo: (formData.get('photo') as string).trim(),
      email: (formData.get('email') as string).trim().toLowerCase(),
      phone: (formData.get('phone') as string).trim(),
      website: (formData.get('website') as string).trim(),
      socialLinks: (formData.get('socialLinks') as string).trim(),
    };

    const submitBtn = form.querySelector('button')!;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving...';

    try {
      if (this.existingItemId) {
        await this.store!.update(this.existingItemId, profileData);
      } else {
        await this.store!.insert({
          ...profileData,
          joinDate: new Date().toISOString().split('T')[0],
        });
      }

      this.showMessage(this.existingItemId ? 'Profile updated!' : 'Profile created!', 'success');
      submitBtn.textContent = this.existingItemId ? 'Update Profile' : 'Submitted';
      submitBtn.disabled = false;
    } catch (error) {
      console.error('Failed to save profile:', error);
      const message = error instanceof Error ? error.message : String(error);
      this.showMessage('Failed to save profile: ' + message, 'error');
      submitBtn.textContent = 'Submit Profile';
      submitBtn.disabled = false;
    }
  }

  showMessage(text: string, type: 'success' | 'error') {
    const el = this.querySelector('#form-message') as HTMLElement;
    if (el) {
      el.textContent = text;
      el.className = `${styles.message} ${styles[type]}`;
    }
  }

  esc(str: string): string {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
}

export default MemberProfileForm;
