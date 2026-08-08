import { Component, model, signal } from '@angular/core';
import { RegulationAction, RegulationType, StructuredRegulation } from '../models';

type ValueType = 'Amount' | 'Text' | 'Days' | 'Percentage';

@Component({
  selector: 'app-structured-form',
  template: `
    <div class="flex flex-col gap-4">
      <div class="rounded-lg border border-navy-200 bg-white p-5">
        <h3 class="mb-4 font-serif-display text-sm font-semibold italic text-navy-700">Regulation Details</h3>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label class="mb-1.5 block font-serif-display text-xs font-medium italic text-navy-500">Name (Arabic)</label>
            <input
              type="text"
              [value]="data()?.name_ar ?? ''"
              (input)="patchField('name_ar', $any($event.target).value)"
              dir="rtl"
              class="w-full rounded-md border border-navy-200 bg-parchment-50 px-3 py-2 font-serif-body text-sm text-navy-800 placeholder:text-navy-300 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-300"
            />
          </div>
          <div>
            <label class="mb-1.5 block font-serif-display text-xs font-medium italic text-navy-500">Name (English)</label>
            <input
              type="text"
              [value]="data()?.name_en ?? ''"
              (input)="patchField('name_en', $any($event.target).value)"
              class="w-full rounded-md border border-navy-200 bg-parchment-50 px-3 py-2 font-serif-body text-sm text-navy-800 placeholder:text-navy-300 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-300"
            />
          </div>
          <div class="sm:col-span-2">
            <label class="mb-1.5 block font-serif-display text-xs font-medium italic text-navy-500">Description (Arabic)</label>
            <textarea
              [value]="data()?.description_ar ?? ''"
              (input)="patchField('description_ar', $any($event.target).value)"
              dir="rtl"
              rows="2"
              class="w-full resize-y rounded-md border border-navy-200 bg-parchment-50 px-3 py-2 font-serif-body text-sm text-navy-800 placeholder:text-navy-300 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-300"
            ></textarea>
          </div>
          <div class="sm:col-span-2">
            <label class="mb-1.5 block font-serif-display text-xs font-medium italic text-navy-500">Description (English)</label>
            <textarea
              [value]="data()?.description_en ?? ''"
              (input)="patchField('description_en', $any($event.target).value)"
              rows="2"
              class="w-full resize-y rounded-md border border-navy-200 bg-parchment-50 px-3 py-2 font-serif-body text-sm text-navy-800 placeholder:text-navy-300 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-300"
            ></textarea>
          </div>
        </div>
      </div>

      @if (data()?.regulationTypes; as types) {
        @for (type of types; track type.id) {
          <div class="overflow-hidden rounded-lg border border-navy-200 bg-white">
            <button
              type="button"
              (click)="toggleType(type.id)"
              class="flex w-full items-center justify-between px-5 py-3.5 text-left transition-colors hover:bg-parchment-50/60 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-gold-500"
              [attr.aria-expanded]="isExpanded(type.id)"
            >
              <div class="flex flex-col gap-0.5">
                @if (type.name_ar) {
                  <span class="font-serif-display text-sm font-medium text-navy-800" dir="rtl">{{ type.name_ar }}</span>
                }
                <span class="font-serif-body text-sm text-navy-500">{{ type.name_en }}</span>
              </div>
              <svg
                class="h-4 w-4 text-navy-400 transition-transform"
                [class.rotate-90]="isExpanded(type.id)"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            @if (isExpanded(type.id)) {
              <div class="border-t border-navy-100 bg-parchment-50/30 px-5 pb-5 pt-4">
                <div class="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label class="mb-1.5 block font-serif-display text-xs font-medium italic text-navy-500">Type Name (Arabic)</label>
                    <input
                      type="text"
                      [value]="type.name_ar"
                      (input)="patchTypeField(type.id, 'name_ar', $any($event.target).value)"
                      dir="rtl"
                      class="w-full rounded-md border border-navy-200 bg-white px-3 py-2 font-serif-body text-sm text-navy-800 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-300"
                    />
                  </div>
                  <div>
                    <label class="mb-1.5 block font-serif-display text-xs font-medium italic text-navy-500">Type Name (English)</label>
                    <input
                      type="text"
                      [value]="type.name_en"
                      (input)="patchTypeField(type.id, 'name_en', $any($event.target).value)"
                      class="w-full rounded-md border border-navy-200 bg-white px-3 py-2 font-serif-body text-sm text-navy-800 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-300"
                    />
                  </div>
                </div>

                @if (type.regulationActions.length > 0) {
                  <div class="flex flex-col gap-2">
                    @for (action of type.regulationActions; track action.id) {
                      <div class="rounded-md border border-navy-200 bg-white p-3">
                        <div class="mb-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                          <div>
                            <label class="mb-1.5 block font-serif-display text-xs font-medium italic text-navy-500">Action (Arabic)</label>
                            <input
                              type="text"
                              [value]="action.action_ar"
                              (input)="patchActionField(type.id, action.id, 'action_ar', $any($event.target).value)"
                              dir="rtl"
                              class="w-full rounded-md border border-navy-200 bg-parchment-50 px-3 py-2 font-serif-body text-sm text-navy-800 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-300"
                            />
                          </div>
                          <div>
                            <label class="mb-1.5 block font-serif-display text-xs font-medium italic text-navy-500">Action (English)</label>
                            <input
                              type="text"
                              [value]="action.action_en"
                              (input)="patchActionField(type.id, action.id, 'action_en', $any($event.target).value)"
                              class="w-full rounded-md border border-navy-200 bg-parchment-50 px-3 py-2 font-serif-body text-sm text-navy-800 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-300"
                            />
                          </div>
                        </div>
                        <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
                          <div>
                            <label class="mb-1.5 block font-serif-display text-xs font-medium italic text-navy-500">Type</label>
                            <select
                              [value]="action.action_type"
                              (change)="patchActionField(type.id, action.id, 'action_type', $any($event.target).value)"
                              class="w-full rounded-md border border-navy-200 bg-parchment-50 px-2 py-2 font-serif-body text-sm text-navy-800 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-300"
                            >
                              <option value="Penalty">Penalty</option>
                              <option value="Addition">Addition</option>
                            </select>
                          </div>
                          <div>
                            <label class="mb-1.5 block font-serif-display text-xs font-medium italic text-navy-500">Value Type</label>
                            <select
                              [value]="valueType(action)"
                              (change)="selectValueType(type.id, action.id, $any($event.target).value)"
                              class="w-full rounded-md border border-navy-200 bg-parchment-50 px-2 py-2 font-serif-body text-sm text-navy-800 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-300"
                            >
                              <option value="Amount">Amount</option>
                              <option value="Text">Text</option>
                              <option value="Days">Days</option>
                              <option value="Percentage">Percentage</option>
                            </select>
                          </div>
                          <div>
                            <label class="mb-1.5 block font-serif-display text-xs font-medium italic text-navy-500">Value</label>
                            @if (valueType(action) === 'Text') {
                              <input
                                type="text"
                                [value]="action.text_value ?? ''"
                                (input)="patchActionField(type.id, action.id, 'text_value', $any($event.target).value)"
                                class="w-full rounded-md border border-navy-200 bg-parchment-50 px-3 py-2 font-mono-data text-sm text-navy-800 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-300"
                              />
                            } @else if (valueType(action) === 'Amount') {
                              <input
                                type="number"
                                step="0.01"
                                [value]="action.decimal_value ?? ''"
                                (input)="patchActionField(type.id, action.id, 'decimal_value', toNumber($any($event.target).value))"
                                class="w-full rounded-md border border-navy-200 bg-parchment-50 px-3 py-2 font-mono-data text-sm text-navy-800 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-300"
                              />
                            } @else if (valueType(action) === 'Days') {
                              <input
                                type="number"
                                step="0.01"
                                [value]="action.days_value ?? ''"
                                (input)="patchActionField(type.id, action.id, 'days_value', toNumber($any($event.target).value))"
                                class="w-full rounded-md border border-navy-200 bg-parchment-50 px-3 py-2 font-mono-data text-sm text-navy-800 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-300"
                              />
                            } @else if (valueType(action) === 'Percentage') {
                              <input
                                type="number"
                                step="0.01"
                                [value]="action.percentage_value ?? ''"
                                (input)="patchActionField(type.id, action.id, 'percentage_value', toNumber($any($event.target).value))"
                                class="w-full rounded-md border border-navy-200 bg-parchment-50 px-3 py-2 font-mono-data text-sm text-navy-800 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-300"
                              />
                            }
                          </div>
                          <div class="flex items-end">
                            <span class="mb-1.5 font-serif-display text-xs italic text-navy-400">
                              @if (valueType(action) === 'Amount') { EGP }
                              @else if (valueType(action) === 'Days') { days }
                              @else if (valueType(action) === 'Percentage') { % }
                            </span>
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                } @else {
                  <p class="py-3 text-center font-serif-display text-xs italic text-navy-400">No actions defined for this type.</p>
                }
              </div>
            }
          </div>
        }
      } @else {
        <div class="rounded-lg border border-navy-200 bg-white px-5 py-10 text-center">
          <p class="font-serif-display text-sm italic text-navy-400">No regulation types extracted from the document.</p>
        </div>
      }
    </div>
  `,
})
export class StructuredFormComponent {
  readonly data = model<StructuredRegulation | null>(null);
  protected readonly expandedTypes = signal<Set<string>>(new Set());

  protected isExpanded(typeId: string): boolean {
    return this.expandedTypes().has(typeId);
  }

  protected toggleType(typeId: string): void {
    this.expandedTypes.update((s) => {
      const next = new Set(s);
      if (next.has(typeId)) {
        next.delete(typeId);
      } else {
        next.add(typeId);
      }
      return next;
    });
  }

  protected valueType(action: RegulationAction): ValueType {
    return action.penalty_value_type ?? action.addition_value_type ?? 'Amount';
  }

  protected toNumber(value: string): number | null {
    const n = Number(value);
    return Number.isNaN(n) ? null : n;
  }

  protected patchField<K extends keyof StructuredRegulation>(
    key: K,
    value: StructuredRegulation[K],
  ): void {
    const current = this.data();
    if (!current) {
      return;
    }
    this.data.set({ ...current, [key]: value });
  }

  protected patchTypeField(typeId: string, key: keyof RegulationType, value: string): void {
    const current = this.data();
    if (!current) {
      return;
    }
    this.data.set({
      ...current,
      regulationTypes: current.regulationTypes.map((t) =>
        t.id === typeId ? { ...t, [key]: value } : t,
      ),
    });
  }

  protected patchActionField(
    typeId: string,
    actionId: string,
    key: keyof RegulationAction,
    value: unknown,
  ): void {
    const current = this.data();
    if (!current) {
      return;
    }
    this.data.set({
      ...current,
      regulationTypes: current.regulationTypes.map((t) =>
        t.id === typeId
          ? {
              ...t,
              regulationActions: t.regulationActions.map((a) =>
                a.id === actionId ? { ...a, [key]: value } : a,
              ),
            }
          : t,
      ),
    });
  }

  protected selectValueType(typeId: string, actionId: string, newType: ValueType): void {
    const current = this.data();
    if (!current) {
      return;
    }
    const action = current.regulationTypes
      .find((t) => t.id === typeId)
      ?.regulationActions.find((a) => a.id === actionId);
    if (!action) {
      return;
    }

    const isPenalty = action.action_type === 'Penalty' || action.action_type === undefined;
    const updates: Partial<RegulationAction> = {
      text_value: null,
      decimal_value: null,
      days_value: null,
      percentage_value: null,
    };

    if (isPenalty) {
      updates.penalty_value_type = newType;
      updates.addition_value_type = null;
    } else {
      updates.addition_value_type = newType;
      updates.penalty_value_type = null;
    }

    const root = this.data()!;
    this.data.set({
      ...root,
      regulationTypes: root.regulationTypes.map((t) =>
        t.id === typeId
          ? {
              ...t,
              regulationActions: t.regulationActions.map((a) =>
                a.id === actionId
                  ? { ...a, ...updates }
                  : a,
              ),
            }
          : t,
      ),
    });
  }
}
