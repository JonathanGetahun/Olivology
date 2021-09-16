import { whisper } from '@oliveai/ldk';
import { stripIndent } from 'common-tags';

export default class FilesystemWhisper {
  constructor(fileContents) {
    this.whisper = undefined;
    this.label = 'Example Filesystem Aptitude Whisper';
    this.props = {
      fileContents,
    };
  }

  createComponents() {
    const markdown = {
      type: whisper.WhisperComponentType.Markdown,
      body: stripIndent`
      # Example File Contents
      ${this.props.fileContents}
      `,
    };

    return [markdown];
  }

  show() {
    whisper
      .create({
        components: this.createComponents(),
        label: this.label,
        onClose: FilesystemWhisper.onClose,
      })
      .then((newWhisper) => {
        this.whisper = newWhisper;
      });
  }

  close() {
    this.whisper.close(FilesystemWhisper.onClose);
  }

  static onClose(err) {
    if (err) {
      console.error('There was an error closing Filesystem whisper', err);
    }
    console.log('Filesystem whisper closed');
  }
}
