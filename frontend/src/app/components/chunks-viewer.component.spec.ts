import { TestBed } from '@angular/core/testing';
import { ChunksViewerComponent } from './chunks-viewer.component';

const SAMPLE_CHUNKS = [
  { content: 'First chunk content.', index: 0 },
  { content: 'Second chunk content that is longer.', index: 1 },
];

describe('ChunksViewerComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChunksViewerComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ChunksViewerComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders chunk count and content', () => {
    const fixture = TestBed.createComponent(ChunksViewerComponent);
    fixture.componentRef.setInput('chunks', SAMPLE_CHUNKS);
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('2 chunks');
    expect(text).toContain('Chunk #1');
    expect(text).toContain('Chunk #2');
    expect(text).toContain('First chunk content.');
  });

  it('computes total characters', () => {
    const fixture = TestBed.createComponent(ChunksViewerComponent);
    fixture.componentRef.setInput('chunks', SAMPLE_CHUNKS);
    fixture.detectChanges();

    const expected = 'First chunk content.'.length + 'Second chunk content that is longer.'.length;
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain(String(expected));
  });

  it('shows empty message when no chunks', () => {
    const fixture = TestBed.createComponent(ChunksViewerComponent);
    fixture.componentRef.setInput('chunks', []);
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('No chunks generated');
  });
});
