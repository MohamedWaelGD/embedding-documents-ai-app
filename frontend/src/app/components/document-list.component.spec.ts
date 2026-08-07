import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { DocumentListComponent } from './document-list.component';

describe('DocumentListComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentListComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(DocumentListComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders documents from the API', async () => {
    const http = TestBed.inject(HttpTestingController);
    const fixture = TestBed.createComponent(DocumentListComponent);
    fixture.detectChanges();

    const req = http.expectOne('/api/documents');
    req.flush({
      documents: [{ id: '1', filename: 'a.pdf', created_at: '2026-08-07T00:00:00Z' }],
    });
    fixture.detectChanges();
    await fixture.whenStable();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('a.pdf');
    http.verify();
  });

  it('shows empty state when no documents', async () => {
    const http = TestBed.inject(HttpTestingController);
    const fixture = TestBed.createComponent(DocumentListComponent);
    fixture.detectChanges();

    const req = http.expectOne('/api/documents');
    req.flush({ documents: [] });
    fixture.detectChanges();
    await fixture.whenStable();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('No documents uploaded yet');
    http.verify();
  });
});
