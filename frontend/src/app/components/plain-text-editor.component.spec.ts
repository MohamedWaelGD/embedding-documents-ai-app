import { TestBed } from '@angular/core/testing';
import { PlainTextEditorComponent } from './plain-text-editor.component';

describe('PlainTextEditorComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlainTextEditorComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(PlainTextEditorComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('emits text change on input', () => {
    const fixture = TestBed.createComponent(PlainTextEditorComponent);
    const component = fixture.componentInstance;
    let value: string | null = null;
    component.textChange.subscribe((v) => (value = v));

    component.onInput({ target: { value: 'updated text' } } as unknown as Event);
    expect(value).toBe('updated text');
  });

  it('emits restructure request on button click', () => {
    const fixture = TestBed.createComponent(PlainTextEditorComponent);
    const component = fixture.componentInstance;
    let requested = false;
    component.restructureRequested.subscribe(() => (requested = true));

    component.restructureRequested.emit();
    expect(requested).toBe(true);
  });
});
