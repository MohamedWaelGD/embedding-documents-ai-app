import { TestBed } from '@angular/core/testing';
import { ChatMessagesComponent } from './chat-messages.component';

describe('ChatMessagesComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatMessagesComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ChatMessagesComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders user and assistant messages', () => {
    const fixture = TestBed.createComponent(ChatMessagesComponent);
    fixture.componentRef.setInput('messages', [
      { role: 'user', content: 'What is the penalty?' },
      { role: 'assistant', content: 'The penalty is 15.' },
    ]);
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('What is the penalty?');
    expect(text).toContain('The penalty is 15.');
  });

  it('shows empty-state message when no messages', () => {
    const fixture = TestBed.createComponent(ChatMessagesComponent);
    fixture.componentRef.setInput('messages', []);
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Ask a question');
  });
});
