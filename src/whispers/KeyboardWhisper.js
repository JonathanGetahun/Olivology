import { whisper } from '@oliveai/ldk';

export default class KeyboardWhisper {
  constructor(keyboardText) {
    this.whisper = undefined;
    this.label = 'Keyboard Aptitude Fired';
    this.props = {
      keyboardText,
    };
  }

  createComponents() {
    const message = {
      type: whisper.WhisperComponentType.Message,
      body: this.props.keyboardText,
    };

    return [message];
  }

  show() {
    whisper
      .create({
        components: this.createComponents(),
        label: this.label,
        onClose: KeyboardWhisper.onClose,
      })
      .then((newWhisper) => {
        this.whisper = newWhisper;
      });
  }

  close() {
    this.whisper.close(KeyboardWhisper.onClose);
  }

  static onClose(err) {
    if (err) {
      console.error('There was an error closing Keyboard whisper', err);
    }
    console.log('Keyboard whisper closed');
  }
}
