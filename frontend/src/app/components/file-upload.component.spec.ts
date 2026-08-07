import { TestBed } from '@angular/core/testing';
import { FileUploadComponent } from './file-upload.component';

describe('FileUploadComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileUploadComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(FileUploadComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('emits file when a file is selected via input', () => {
    const fixture = TestBed.createComponent(FileUploadComponent);
    const component = fixture.componentInstance;
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    let emitted: File | null = null;
    component.fileSelected.subscribe((f) => (emitted = f));

    component.onFileSelected({ target: { files: [file] } } as unknown as Event);

    expect(emitted).toBe(file);
    expect(component.selectedFile()).toBe(file);
  });

  it('shows selected file name after selection', () => {
    const fixture = TestBed.createComponent(FileUploadComponent);
    const component = fixture.componentInstance;
    const file = new File(['x'], 'regulation.pdf', { type: 'application/pdf' });
    component.onFileSelected({ target: { files: [file] } } as unknown as Event);
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('regulation.pdf');
  });
});
