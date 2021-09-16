import { whisper } from '@oliveai/ldk';

export default class UiWhisper {
  constructor(searchText) {
    this.whisper = undefined;
    this.label = 'UI Search Aptitude Fired';
    this.props = {
      searchText,
    };
  }

  createComponents() {
    const message = {
      type: whisper.WhisperComponentType.Message,
      body: this.props.searchText,
    };

    return [message];
  }

  show() {
    whisper
      .create({
        components: this.createComponents(),
        label: this.label,
        onClose: UiWhisper.onClose,
      })
      .then((newWhisper) => {
        this.whisper = newWhisper;
      });
  }

  close() {
    this.whisper.close(UiWhisper.onClose);
  }

  static onClose(err) {
    if (err) {
      console.error('There was an error closing Ui whisper', err);
    }
    console.log('Ui whisper closed');
  }
}
