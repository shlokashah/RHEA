import { TestBed, inject } from '@angular/core/testing';

import { SpeechSynthesizerService } from './speech-synthesizer.service';

describe('SpeechSynthesizerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SpeechSynthesizerService]
    });
  });

  it('should be created', inject([SpeechSynthesizerService], (service: SpeechSynthesizerService) => {
    expect(service).toBeTruthy();
  }));
});
