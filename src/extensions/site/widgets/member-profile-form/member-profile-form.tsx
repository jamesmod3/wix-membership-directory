import { window as wixWindow } from '@wix/site-window';
import { authentication } from '@wix/site';
import { createDataStore, type DataStore } from './data-store';
import styles from './member-profile-form.module.css';

const PROFILE_PATH = '/membership-directory-profile';

class MemberProfileForm extends HTMLElement {
  static get observedAttributes() {
    return [];
  }

  private store: DataStore | null = null;
  private existingItemId: string | null = null;

  constructor() {
    super();
  }

  async connectedCallback() {
    const viewMode = await wixWindow.viewMode();
    this.store = createDataStore(viewMode === 'Editor');

    if (viewMode !== 'Editor' && window.location.pathname !== PROFILE_PATH) {
      console.log('[Member Profile Widget] Loaded on', window.location.pathname, '— registering onLogin');
      this.style.display = 'none';
      const REDIRECTED_KEY = 'membership-directory-redirected';
      if (!sessionStorage.getItem(REDIRECTED_KEY)) {
        authentication.onLogin(async () => {
          sessionStorage.setItem(REDIRECTED_KEY, 'true');
          if (window.location.pathname === PROFILE_PATH) return;
          try {
            const result = await this.store!.queryMyProfile();
            if (result.items.length > 0) return;
          } catch {}
          window.location.href = PROFILE_PATH;
        });
      }
      return;
    }

    await this.init();
  }

  attributeChangedCallback() {}

  async init() {
    try {
      const result = await this.store!.queryMyProfile();
      if (result.items.length > 0) {
        const item = result.items[0];
        this.existingItemId = item._id;
        this.renderForm(item);
      } else {
        this.renderForm(null);
      }
    } catch (error) {
      console.error('Failed to check existing profile:', error);
      this.renderForm(null);
    }
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
            Email <span class="${styles.required}">*</span>
            <input type="email" name="email" value="${this.esc(data?.email || '')}" required class="${styles.input}" />
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

      this.showMessage(
        this.existingItemId ? 'Profile updated!' : 'Profile created!',
        'success'
      );
      submitBtn.textContent = this.existingItemId ? 'Update Profile' : 'Submitted';
      submitBtn.disabled = false;
    } catch (error) {
      console.error('Failed to save profile:', error);
      const message = error instanceof Error ? error.message : String(error);
      this.showMessage('Failed to save profile: ' + message, 'error');
      submitBtn.textContent = this.existingItemId ? 'Update Profile' : 'Submit Profile';
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
