import { whisper } from '@oliveai/ldk';

export default class OlivologyWhisper {
  constructor(searchText) {
    this.whisper = undefined;
    this.label = 'Olivology Aptitude Fired';
    this.labelInstruction = 'Olivology Whisper';
    this.props = {
      searchText,
    };
    this.instruction = `This Loop is triggered when you search a word created for use within Olive. To do so enter "/define" followed by a space and the word you to lookup after.`;
  }

  createInstructions() {
    const message = {
      type: whisper.WhisperComponentType.Message,
      body: this.instruction,
    };

    return [message];
  }

  instructions() {
    whisper
      .create({
        components: this.createInstructions(),
        label: this.labelInstruction,
        onClose: OlivologyWhisper.onClose,
      })
      .then((newWhisper) => {
        this.whisper = newWhisper;
      });
  }

  createComponents() {
    const message =
      this.props.searchText === null
        ? {
            type: whisper.WhisperComponentType.Message,
            header: `No Matching Word Found`,
            body: 'Please Try Another Word',
          }
        : {
            type: whisper.WhisperComponentType.Message,
            header: `${this.props.searchText.word}`,
            body: this.props.searchText.definition,
          };

    return [message];
  }

  show() {
    whisper
      .create({
        components: this.createComponents(),
        label: this.label,
        onClose: OlivologyWhisper.onClose,
      })
      .then((newWhisper) => {
        this.whisper = newWhisper;
      });
  }

  close() {
    this.whisper.close(OlivologyWhisper.onClose);
  }

  static onClose(err) {
    if (err) {
      console.error('There was an error closing Ui whisper', err);
    }
    console.log('Ui whisper closed');
  }
}
