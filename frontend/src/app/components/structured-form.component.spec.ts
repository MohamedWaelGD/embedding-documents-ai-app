import { TestBed } from '@angular/core/testing';
import { StructuredFormComponent } from './structured-form.component';

const SAMPLE_REGULATION = {
  id: 'reg-1',
  document_id: 'doc-1',
  name_ar: 'لائحة شؤون الموظفين',
  name_en: 'Employee Affairs Regulation',
  description_ar: 'وصف اللائحة',
  description_en: 'Regulation description',
  regulationTypes: [
    {
      id: 'type-1',
      regulation_id: 'reg-1',
      name_ar: 'لائحة الحضور',
      name_en: 'Attendance Regulation',
      regulationActions: [
        {
          id: 'act-1',
          type_id: 'type-1',
          action_ar: 'تأخير بدون عذر',
          action_en: 'Unexcused Delay',
          action_type: 'Penalty' as const,
          penalty_value_type: 'Amount' as const,
          addition_value_type: null,
          text_value: null,
          decimal_value: 15,
          days_value: null,
          percentage_value: null,
        },
      ],
    },
  ],
};

function setData(fixture: ReturnType<typeof TestBed.createComponent<StructuredFormComponent>>) {
  fixture.componentInstance.data.set(SAMPLE_REGULATION);
  fixture.detectChanges();
}

function allInputs(el: HTMLElement): HTMLInputElement[] {
  return Array.from(el.querySelectorAll<HTMLInputElement>('input, textarea'));
}

function inputByValue(el: HTMLElement, value: string): HTMLInputElement | null {
  return allInputs(el).find((i) => i.value === value) ?? null;
}

describe('StructuredFormComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StructuredFormComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(StructuredFormComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders regulation name inputs with Arabic and English values', () => {
    const fixture = TestBed.createComponent(StructuredFormComponent);
    setData(fixture);

    expect(inputByValue(fixture.nativeElement, SAMPLE_REGULATION.name_ar)).toBeTruthy();
    expect(inputByValue(fixture.nativeElement, SAMPLE_REGULATION.name_en)).toBeTruthy();
  });

  it('renders regulation type name as accordion text', () => {
    const fixture = TestBed.createComponent(StructuredFormComponent);
    setData(fixture);

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Attendance Regulation');
  });

  it('expands accordion and shows action fields on click', () => {
    const fixture = TestBed.createComponent(StructuredFormComponent);
    setData(fixture);

    const buttons = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('button'),
    );
    const toggleBtn = buttons.find((b) => b.textContent?.includes('Attendance Regulation'));
    expect(toggleBtn).toBeTruthy();
    toggleBtn!.click();
    fixture.detectChanges();

    // After expanding, the action's English name input should be visible
    expect(inputByValue(fixture.nativeElement, 'Unexcused Delay')).toBeTruthy();
  });

  it('emits updated regulation when user changes a text field', () => {
    const fixture = TestBed.createComponent(StructuredFormComponent);
    setData(fixture);

    const nameEnInput = inputByValue(fixture.nativeElement, 'Employee Affairs Regulation');
    expect(nameEnInput).toBeTruthy();

    const nativeSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value',
    )?.set;
    nativeSetter?.call(nameEnInput, 'Updated Name');
    nameEnInput!.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const updated = fixture.componentInstance.data();
    expect(updated?.name_en).toBe('Updated Name');
  });
});
