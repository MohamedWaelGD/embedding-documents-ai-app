import { TestBed } from '@angular/core/testing';
import { ChatInputComponent } from './chat-input.component';

describe('ChatInputComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatInputComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ChatInputComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('emits query on submit and clears input', () => {
    const fixture = TestBed.createComponent(ChatInputComponent);
    const component = fixture.componentInstance;
    let emitted: string | null = null;
    component.submitted.subscribe((q) => (emitted = q));

    component.onInput({ target: { value: 'my question' } } as unknown as Event);
    component.onSubmit(new Event('submit'));

    expect(emitted).toBe('my question');
    expect(component['value']()).toBe('');
  });

  it('does not emit for empty or whitespace-only query', () => {
    const fixture = TestBed.createComponent(ChatInputComponent);
    const component = fixture.componentInstance;
    let count = 0;
    component.submitted.subscribe(() => count++);

    component.onInput({ target: { value: '   ' } } as unknown as Event);
    component.onSubmit(new Event('submit'));

    expect(count).toBe(0);
  });
});
