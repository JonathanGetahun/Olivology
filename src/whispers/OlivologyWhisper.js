import { whisper } from '@oliveai/ldk';
import { add, deleteWord, editWord } from '../aptitudes/olivology/olivologyExample';
import { stripIndent } from 'common-tags';

export default class OlivologyWhisper {
  constructor(searchText) {
    this.whisper = undefined;
    this.label = 'Olivology';
    this.addLabelPass = 'Word was successfully added!';
    this.addLabelDouble = 'This word already exists.';
    this.delLabel = 'Word was successfully deleted!';
    this.delLabelFail = 'No such word exists, unable to delete.';
    this.editLabelPass = 'Word was successfully edited';
    this.editLabelFail = 'No such word exists, unable to edit.';
    this.editLabelNoDef = 'Please enter a definition to edit.';
    this.labelInstruction = 'Olivology Intro';
    this.props = {
      searchText,
    };
    this.instruction = `This Loop is triggered when you search a word created for use within Olive. To do so enter "/define" followed by a space and the word you want to lookup.`;
    this.word = undefined;
    this.def = undefined;
  }

  createInstructions() {
    const message = {
      type: whisper.WhisperComponentType.Message,
      body: this.instruction,
    };

    const oliveComponentsHeading = {
      type: whisper.WhisperComponentType.Markdown,
      body: '# Choose an option below to modify a word',
    };

    const wordInput = {
      type: whisper.WhisperComponentType.TextInput,
      label: 'word',
      onChange: (_error, val) => {
        this.word = val;
        console.log('Text changed: ', val);
      },
    };

    const defInput = {
      type: whisper.WhisperComponentType.TextInput,
      label: 'definition',
      onChange: (_error, val) => {
        this.def = val;
        console.log('Text changed: ', val);
      },
    };

    const addButton = {
      type: whisper.WhisperComponentType.Button,
      label: 'Add',
      onClick: () => {
        add(this.word, this.def);
        console.log('Add button clicked.');
      },
    };

    const deleteButton = {
      type: whisper.WhisperComponentType.Button,
      label: 'Delete',
      onClick: () => {
        deleteWord(this.word);
        console.log('Delete button clicked.');
      },
    };

    const editButton = {
      type: whisper.WhisperComponentType.Button,
      label: 'Edit',
      onClick: () => {
        editWord(this.word, this.def);
        console.log('Edit button clicked.');
      },
    };

    const box = {
      type: whisper.WhisperComponentType.Box,
      children: [addButton, editButton, deleteButton],
      direction: whisper.Direction.Horizontal,
      justifyContent: whisper.JustifyContent.SpaceEvenly,
    };

    return [oliveComponentsHeading, wordInput, defInput, box, message];
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

  addEditComponent() {
    const message = {
      type: whisper.WhisperComponentType.Message,
      header: `${this.props.searchText.word}`,
      body: this.props.searchText.definition,
    };

    return [message];
  }

  addedWord() {
    whisper
      .create({
        components: this.addComponent(),
        label: this.addLabelPass,
        onClose: OlivologyWhisper.onClose,
      })
      .then((newWhisper) => {
        this.whisper = newWhisper;
      });
  }

  doubleWord() {
    whisper
      .create({
        components: this.addComponent(),
        label: this.addLabelDouble,
        onClose: OlivologyWhisper.onClose,
      })
      .then((newWhisper) => {
        this.whisper = newWhisper;
      });
  }

  delComponent() {
    const message = {
      type: whisper.WhisperComponentType.Message,
      header: `${this.props.searchText.word}`,
    };

    return [message];
  }

  delWord() {
    whisper
      .create({
        components: this.delComponent(),
        label: this.delLabel,
        onClose: OlivologyWhisper.onClose,
      })
      .then((newWhisper) => {
        this.whisper = newWhisper;
      });
  }

  delWordFail() {
    whisper
      .create({
        components: this.delComponent(),
        label: this.delLabelFail,
        onClose: OlivologyWhisper.onClose,
      })
      .then((newWhisper) => {
        this.whisper = newWhisper;
      });
  }

  editWords() {
    whisper
      .create({
        components: this.addEditComponent(),
        label: this.editLabelPass,
        onClose: OlivologyWhisper.onClose,
      })
      .then((newWhisper) => {
        this.whisper = newWhisper;
      });
  }

  editWordFail() {
    whisper
      .create({
        components: this.delComponent(),
        label: this.editLabelFail,
        onClose: OlivologyWhisper.onClose,
      })
      .then((newWhisper) => {
        this.whisper = newWhisper;
      });
  }

  editWordNoDef() {
    whisper
      .create({
        components: this.delComponent(),
        label: this.editLabelNoDef,
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
