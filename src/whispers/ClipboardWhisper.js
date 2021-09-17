import { whisper } from '@oliveai/ldk';

export default class ClipboardWhisper {
  constructor(clipboardText) {
    this.whisper = undefined;
    this.label = 'Clipboard Aptitude Fired';
    this.props = {
      clipboardText,
    };
  }

  createComponents() {
    const message = {
      type: whisper.WhisperComponentType.Message,
      body: this.props.clipboardText,
    };

    return [message];
  }

  show() {
    whisper
      .create({
        components: this.createComponents(),
        label: this.label,
        onClose: ClipboardWhisper.onClose,
      })
      .then((newWhisper) => {
        this.whisper = newWhisper;
      });
  }

  close() {
    this.whisper.close(ClipboardWhisper.onClose);
  }

  static onClose(err) {
    if (err) {
      console.error('There was an error closing Clipboard whisper', err);
    }
    console.log('Clipboard whisper closed');
  }
}
