import { whisper } from '@oliveai/ldk';
import { stripIndent } from 'common-tags';

export default class OlivologyWhisper {
  constructor(searchText) {
    this.whisper = undefined;
    this.label = 'Olivology';
    this.labelInstruction = 'Olivology Intro';
    this.props = {
      searchText,
    };
    this.instruction = stripIndent`
    This Loop is triggered when you search a word created for use within Olive. To do so enter \`olive\` followed by a space and the word you want to lookup. 
    
    You can also copy a word or a sentence and Olivology will find words that match or are similar.`;
    this.word = undefined;
    this.def = undefined;
  }

  createInstructions() {
    const message = {
      type: whisper.WhisperComponentType.Markdown,
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

  createDefinitionComponents() {
    const messages = [];
    const wordDict = Object.keys(this.props.searchText);
    wordDict.forEach((word) => {
      const collapsibleContent = {
        type: whisper.WhisperComponentType.Markdown,
        body: stripIndent`
        # ${word}
        ${this.props.searchText[`${word}`]}`,
      };

      messages.push({
        type: whisper.WhisperComponentType.CollapseBox,
        children: [collapsibleContent],
        open: false,
        label: `${word}`,
      });
    });

    return messages;
  }

  definitionShow() {
    whisper
      .create({
        components: this.createDefinitionComponents(),
        label: this.label,
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
