import { faHandHoldingDollar, faTrashCan, faXmark, faCirclePlus, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

interface Asset {
  type: string;
  value: number | null;
}

declare const bootstrap: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})

export class AppComponent {
  faHandHoldingDollar = faHandHoldingDollar;
  faTrashCan = faTrashCan;
  faXmark = faXmark;
  faCirclePlus = faCirclePlus;
  faChevronDown = faChevronDown;

  assets: Asset[] = [];
  assetsSaved = false;

  draftAssets: Asset[] = [{ type: '', value: null }];
  inputValues: string[] = [''];

  openModal(): void {
    this.draftAssets = this.assets.length ? JSON.parse(JSON.stringify(this.assets)) : [{ type: '', value: null }];
    this.inputValues = this.draftAssets.map(a => (a.value !== null ? a.value.toString() : ''));
  }

  addAsset(): void {
    this.draftAssets.push({ type: '', value: null });
    this.inputValues.push('');
  }

  removeAsset(index: number): void {
    this.draftAssets.splice(index, 1);
    this.inputValues.splice(index, 1);
  }

  removeAssetLast(index: number): void {
    this.assets.splice(index, 1);
    if (this.assets.length === 0) {
      this.assetsSaved = false;
    }
  }

  onValueInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const rawValue = input.value;
    const validRegex = /^\d*(\.\d{0,2})?$/;

    if (validRegex.test(rawValue)) {
      this.inputValues[index] = rawValue;
      this.draftAssets[index].value = rawValue ? parseFloat(rawValue) : null;
    } else {
      input.value = this.inputValues[index];
    }
  }

  get isSaveDisabled(): boolean {
    return this.draftAssets.some((asset, i) => {
      const hasType = asset.type && asset.type.trim() !== '';
      const hasValue = this.inputValues[i] && this.inputValues[i].trim() !== '';
      return !(hasType && hasValue);
    });
  }

  get totalAssetValue(): number {
    return this.assets.reduce((sum, asset) => sum + (asset.value || 0), 0);
  }

  saveAssets(): void {
    const hasInvalid = this.draftAssets.some((asset, i) => {
      const hasType = asset.type && asset.type.trim() !== '';
      const hasValue = this.inputValues[i] && this.inputValues[i].trim() !== '';
      return !(hasType && hasValue);
    });
  
    if (hasInvalid) {
      this.showValidationError = true;
      return;
    }
  
    this.assets = this.draftAssets.map(a => ({
      type: a.type,
      value: a.value !== null ? parseFloat(a.value.toFixed(2)) : null,
    }));
    this.assetsSaved = true;
    this.showValidationError = false;
  
    const modalEl = document.getElementById('addAssetsModal');
    if (modalEl) {
      const modalInstance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
      modalInstance.hide();
    }
  }

  showValidationError = false;

}

