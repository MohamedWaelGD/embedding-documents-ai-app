import { Component, model, signal } from '@angular/core';
import { RegulationAction, RegulationType, StructuredRegulation } from '../models';

type ValueType = 'Amount' | 'Text' | 'Days' | 'Percentage';

@Component({
  selector: 'app-structured-form',
  template: `
    <div class="flex flex-col gap-4">
      <div class="rounded-lg border border-slate-200 bg-white p-4">
        <h3 class="mb-3 text-sm font-semibold text-slate-700">Regulation Details</h3>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label class="mb-1 block text-xs font-medium text-slate-500">Name (Arabic)</label>
            <input
              type="text"
              [value]="data()?.name_ar ?? ''"
              (input)="patchField('name_ar', $any($event.target).value)"
              dir="rtl"
              class="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div>
            <label class="mb-1 block text-xs font-medium text-slate-500">Name (English)</label>
            <input
              type="text"
              [value]="data()?.name_en ?? ''"
              (input)="patchField('name_en', $any($event.target).value)"
              class="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div class="sm:col-span-2">
            <label class="mb-1 block text-xs font-medium text-slate-500">Description (Arabic)</label>
            <textarea
              [value]="data()?.description_ar ?? ''"
              (input)="patchField('description_ar', $any($event.target).value)"
              dir="rtl"
              rows="2"
              class="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            ></textarea>
          </div>
          <div class="sm:col-span-2">
            <label class="mb-1 block text-xs font-medium text-slate-500">Description (English)</label>
            <textarea
              [value]="data()?.description_en ?? ''"
              (input)="patchField('description_en', $any($event.target).value)"
              rows="2"
              class="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            ></textarea>
          </div>
        </div>
      </div>

      @if (data()?.regulationTypes; as types) {
        @for (type of types; track type.id) {
          <div class="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <button
              type="button"
              (click)="toggleType(type.id)"
              class="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-blue-600"
              [attr.aria-expanded]="isExpanded(type.id)"
            >
              <div class="flex flex-col gap-0.5">
                @if (type.name_ar) {
                  <span class="text-sm font-medium text-slate-800" dir="rtl">{{ type.name_ar }}</span>
                }
                <span class="text-sm text-slate-500">{{ type.name_en }}</span>
              </div>
              <span aria-hidden="true" class="text-slate-400 transition-transform" [class.rotate-90]="isExpanded(type.id)">
                ▸
              </span>
            </button>

            @if (isExpanded(type.id)) {
              <div class="border-t border-slate-100 px-4 pb-4 pt-3">
                <div class="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div>
                    <label class="mb-1 block text-xs font-medium text-slate-500">Type Name (Arabic)</label>
                    <input
                      type="text"
                      [value]="type.name_ar"
                      (input)="patchTypeField(type.id, 'name_ar', $any($event.target).value)"
                      dir="rtl"
                      class="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                  <div>
                    <label class="mb-1 block text-xs font-medium text-slate-500">Type Name (English)</label>
                    <input
                      type="text"
                      [value]="type.name_en"
                      (input)="patchTypeField(type.id, 'name_en', $any($event.target).value)"
                      class="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                </div>

                @if (type.regulationActions.length > 0) {
                  <div class="flex flex-col gap-2">
                    @for (action of type.regulationActions; track action.id) {
                      <div
                        class="rounded-md border border-slate-200 bg-slate-50 p-3"
                      >
                        <div class="mb-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                          <div>
                            <label class="mb-1 block text-xs font-medium text-slate-500">Action (Arabic)</label>
                            <input
                              type="text"
                              [value]="action.action_ar"
                              (input)="patchActionField(type.id, action.id, 'action_ar', $any($event.target).value)"
                              dir="rtl"
                              class="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            />
                          </div>
                          <div>
                            <label class="mb-1 block text-xs font-medium text-slate-500">Action (English)</label>
                            <input
                              type="text"
                              [value]="action.action_en"
                              (input)="patchActionField(type.id, action.id, 'action_en', $any($event.target).value)"
                              class="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            />
                          </div>
                        </div>
                        <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
                          <div>
                            <label class="mb-1 block text-xs font-medium text-slate-500">Type</label>
                            <select
                              [value]="action.action_type"
                              (change)="patchActionField(type.id, action.id, 'action_type', $any($event.target).value)"
                              class="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            >
                              <option value="Penalty">Penalty</option>
                              <option value="Addition">Addition</option>
                            </select>
                          </div>
                          <div>
                            <label class="mb-1 block text-xs font-medium text-slate-500">Value Type</label>
                            <select
                              [value]="valueType(action)"
                              (change)="selectValueType(type.id, action.id, $any($event.target).value)"
                              class="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            >
                              <option value="Amount">Amount</option>
                              <option value="Text">Text</option>
                              <option value="Days">Days</option>
                              <option value="Percentage">Percentage</option>
                            </select>
                          </div>
                          <div>
                            <label class="mb-1 block text-xs font-medium text-slate-500">Value</label>
                            @if (valueType(action) === 'Text') {
                              <input
                                type="text"
                                [value]="action.text_value ?? ''"
                                (input)="patchActionField(type.id, action.id, 'text_value', $any($event.target).value)"
                                class="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                              />
                            } @else if (valueType(action) === 'Amount') {
                              <input
                                type="number"
                                step="0.01"
                                [value]="action.decimal_value ?? ''"
                                (input)="patchActionField(type.id, action.id, 'decimal_value', toNumber($any($event.target).value))"
                                class="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                              />
                            } @else if (valueType(action) === 'Days') {
                              <input
                                type="number"
                                step="0.01"
                                [value]="action.days_value ?? ''"
                                (input)="patchActionField(type.id, action.id, 'days_value', toNumber($any($event.target).value))"
                                class="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                              />
                            } @else if (valueType(action) === 'Percentage') {
                              <input
                                type="number"
                                step="0.01"
                                [value]="action.percentage_value ?? ''"
                                (input)="patchActionField(type.id, action.id, 'percentage_value', toNumber($any($event.target).value))"
                                class="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                              />
                            }
                          </div>
                          <div class="flex items-end">
                            <span class="mb-1.5 text-xs text-slate-400">
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
                  <p class="py-2 text-center text-xs text-slate-400">No actions defined for this type.</p>
                }
              </div>
            }
          </div>
        }
      } @else {
        <div class="rounded-lg border border-slate-200 bg-white px-4 py-8 text-center">
          <p class="text-sm text-slate-400">No regulation types extracted from the document.</p>
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
    return (
      action.penalty_value_type ??
      action.addition_value_type ??
      'Amount'
    );
  }

  protected toNumber(value: string): number | null {
    const n = Number(value);
    return Number.isNaN(n) ? null : n;
  }

  /**
   * Deep-clones the current data, applies a patch to a top-level field, and emits.
   */
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

  /**
   * Patches a field on a specific RegulationType by id, then emits the full tree.
   */
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

  /**
   * Patches a field on a specific RegulationAction (by typeId + actionId), then emits.
   */
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

  /**
   * When the user selects a new value type, sets the appropriate
   * penalty/addition value type fields and clears other value fields.
   */
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

    // Apply all the type/value resets in one go
    const root = this.data()!;
    this.data.set({
      ...root,
      regulationTypes: root.regulationTypes.map((t) =>
        t.id === typeId
          ? {
              ...t,
              regulationActions: t.regulationActions.map((a) =>
                a.id === actionId
                  ? {
                      ...a,
                      ...updates,
                    }
                  : a,
              ),
            }
          : t,
      ),
    });
  }
}
