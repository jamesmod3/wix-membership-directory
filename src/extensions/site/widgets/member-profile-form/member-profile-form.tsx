import { window as wixWindow } from '@wix/site-window';
import { members } from '@wix/members';
import { createDataStore, type DataStore } from './data-store';
import { detectPlan, type PlanType, type PlanConfig } from './plan-detect';
import styles from './member-profile-form.module.css';

const CATEGORIES = [
  'Photographer', 'Videographer', 'Painter', 'Musician', 'Baker',
  'Florist', 'Caterer', 'Decorator', 'Officiant', 'DJ',
  'Hair & Makeup', 'Gown & Attire', 'Venue', 'Event Coordinator',
  'Rentals', 'Transportation', 'Other',
];

class MemberProfileForm extends HTMLElement {
  static get observedAttributes() {
    return [];
  }

  private store: DataStore | null = null;
  private memberId: string | null = null;
  private existingItemId: string | null = null;
  private planConfig: PlanConfig = { planType: 'none', descriptionLabel: 'Description / Bio', wordLimit: 300, imageLabel: 'Image URL' };

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
      console.log('[Member Profile] Member ID:', this.memberId);
    } catch (e: any) {
      console.log('[Member Profile] getCurrentMember failed:', e.details?.applicationError?.code || e.message);
    }

    if (!this.memberId) {
      console.log('[Member Profile] No member ID, showing blank form');
      this.renderForm(null);
      return;
    }

    this.planConfig = await detectPlan();
    console.log('[Member Profile] Plan config:', this.planConfig);

    try {
      const result = await this.store.queryByMemberId(this.memberId);
      console.log('[Member Profile] Existing profile:', result.items.length > 0 ? 'found' : 'none');
      if (result.items.length > 0) {
        const item = result.items[0];
        this.existingItemId = item._id;
        this.renderForm(item);
      } else {
        this.renderForm(null);
      }
    } catch {
      console.log('[Member Profile] Query failed, showing blank form');
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
    const p = this.planConfig;
    const isOrg = p.planType === 'organization';
    const isBiz = p.planType === 'business';
    const isIndiv = p.planType === 'individual';

    const selectedCategories = data?.categories ? data.categories.split(',').map((c: string) => c.trim()) : [];

    const categoriesHtml = CATEGORIES.map(cat => `
      <label class="${styles.checkboxLabel}">
        <input type="checkbox" name="categories" value="${this.esc(cat)}" ${selectedCategories.includes(cat) ? 'checked' : ''} />
        ${this.esc(cat)}
      </label>
    `).join('');

    this.innerHTML = `
      <div class="${styles.root}">
        <h2 class="${styles.heading}">${isEdit ? 'Edit Your Profile' : 'Create Your Profile'}</h2>
        <form id="member-form" class="${styles.form}">
          <fieldset class="${styles.fieldset}">
            <legend class="${styles.legend}">Contact Information</legend>

            ${isOrg || isBiz ? `
            <label class="${styles.label}">
              Organization Name <span class="${styles.required}">*</span>
              <input type="text" name="organizationName" value="${this.esc(data?.organizationName || '')}" required class="${styles.input}" placeholder="Your organization or business name" />
            </label>
            ` : `
            <label class="${styles.label}">
              Organization Name
              <input type="text" name="organizationName" value="${this.esc(data?.organizationName || '')}" class="${styles.input}" placeholder="Optional for individual plans" />
            </label>
            `}

            <label class="${styles.label}">
              Contact First Name <span class="${styles.required}">*</span>
              <input type="text" name="name" value="${this.esc(data?.name || '')}" required class="${styles.input}" />
            </label>

            <label class="${styles.label}">
              Contact Last Name <span class="${styles.required}">*</span>
              <input type="text" name="lastName" value="${this.esc(data?.lastName || '')}" required class="${styles.input}" />
            </label>

            <label class="${styles.label}">
              Pronouns
              <input type="text" name="pronouns" value="${this.esc(data?.pronouns || '')}" class="${styles.input}" placeholder="e.g. she/her, he/him, they/them" />
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
              Address
              <input type="text" name="address" value="${this.esc(data?.address || '')}" class="${styles.input}" placeholder="Street, City, State" />
            </label>
          </fieldset>

          <fieldset class="${styles.fieldset}">
            <legend class="${styles.legend}">Listing Details</legend>

            <label class="${styles.label}">
              Categories (up to 4)
            </label>
            <div class="${styles.checkboxGroup}">
              ${categoriesHtml}
            </div>

            <label class="${styles.label}">
              Listing Title <span class="${styles.required}">*</span>
              <input type="text" name="listingTitle" value="${this.esc(data?.listingTitle || '')}" required class="${styles.input}" placeholder="Your headline for the directory" />
            </label>

            <label class="${styles.label}">
              ${this.esc(p.descriptionLabel)} (max ${p.wordLimit} words)
              <textarea name="bio" rows="4" class="${styles.textarea}" oninput="this.dataset.wordCount = this.value.trim() ? this.value.trim().split(/\\s+/).length : 0">${this.esc(data?.bio || '')}</textarea>
              <span class="${styles.wordCount}">0 / ${p.wordLimit} words</span>
            </label>

            <label class="${styles.label}">
              Website
              <input type="url" name="website" value="${this.esc(data?.website || '')}" class="${styles.input}" placeholder="https://example.com" />
            </label>

            <label class="${styles.label}">
              Facebook
              <input type="url" name="facebook" value="${this.esc(data?.facebook || '')}" class="${styles.input}" placeholder="https://facebook.com/your-page" />
            </label>

            <label class="${styles.label}">
              Instagram
              <input type="url" name="instagram" value="${this.esc(data?.instagram || '')}" class="${styles.input}" placeholder="https://instagram.com/your-profile" />
            </label>

            <label class="${styles.label}">
              LinkedIn
              <input type="url" name="linkedin" value="${this.esc(data?.linkedin || '')}" class="${styles.input}" placeholder="https://linkedin.com/in/your-profile" />
            </label>

            <label class="${styles.label}">
              ${this.esc(p.imageLabel)} URL
              <input type="url" name="photo" value="${this.esc(data?.photo || '')}" class="${styles.input}" placeholder="https://example.com/image.jpg" />
            </label>
          </fieldset>

          <button type="submit" class="${styles.button}">${isEdit ? 'Update Profile' : 'Submit Profile'}</button>
        </form>
        <div id="form-message" class="${styles.message}"></div>
      </div>
    `;

    this.querySelector('#member-form')!.addEventListener('submit', (e) => this.handleSubmit(e));

    const bioField = this.querySelector('textarea[name="bio"]') as HTMLTextAreaElement;
    if (bioField) {
      bioField.addEventListener('input', () => {
        const count = bioField.value.trim() ? bioField.value.trim().split(/\s+/).length : 0;
        const wcEl = this.querySelector('.' + styles.wordCount.split(' ')[0]) as HTMLElement;
        if (wcEl) {
          wcEl.textContent = `${count} / ${p.wordLimit} words`;
        }
      });
    }
  }

  async handleSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const categories = formData.getAll('categories') as string[];

    const profileData: Record<string, any> = {
      memberId: this.memberId,
      planType: this.planConfig.planType,
      published: true,
      organizationName: (formData.get('organizationName') as string).trim(),
      name: (formData.get('name') as string).trim(),
      lastName: (formData.get('lastName') as string).trim(),
      pronouns: (formData.get('pronouns') as string).trim(),
      email: (formData.get('email') as string).trim().toLowerCase(),
      phone: (formData.get('phone') as string).trim(),
      address: (formData.get('address') as string).trim(),
      categories: categories.join(', '),
      listingTitle: (formData.get('listingTitle') as string).trim(),
      bio: (formData.get('bio') as string).trim(),
      website: (formData.get('website') as string).trim(),
      facebook: (formData.get('facebook') as string).trim(),
      instagram: (formData.get('instagram') as string).trim(),
      linkedin: (formData.get('linkedin') as string).trim(),
      photo: (formData.get('photo') as string).trim(),
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
