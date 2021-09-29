import { ui, filesystem, network } from '@oliveai/ldk';

import { pluralize } from '@looop/pluralize';
import { OlivologyWhisper } from '../../whispers';

const handler = async (text) => {
  const regText = new RegExp(`/olive .+`);
  const checkText = regText.test(text);
  const dirPath = 'dictionary';
  const searchString = checkText ? text.substring(7) : text;
  const filePath = await filesystem.join([dirPath, 'olivology.txt']);

  // Check to see if user submitted a word preceded by "/define"
  if (checkText) {
    // Check if word searched is in the dictionary
    const encodedFileContents = await filesystem.readFile(filePath);
    const fileContents = await network.decode(encodedFileContents);
    const fileContentsJson = JSON.parse(fileContents);
    const words = Object.keys(fileContentsJson);

    const arrText = searchString.toUpperCase().split(' ');
    const arrMatch = {};
    const checkOliveWord = words.filter((word) => {
      const arrWord = word.toUpperCase().split(' ');
      const testMatch =
        arrText.some(
          (copiedText) => arrWord.includes(copiedText) || arrWord.includes(pluralize(copiedText, 1))
        ) && word.toUpperCase() !== 'THE';
      if (testMatch) arrMatch[`${word}`] = fileContentsJson[`${word}`];
      return testMatch;
    });

    if (checkOliveWord.length >= 1) {
      const whisper = new OlivologyWhisper(arrMatch);
      whisper.definitionShow();
    }
  }
};

const listen = () => {
  ui.listenGlobalSearch(handler);
  ui.listenSearchbar(handler);
};

export { handler };
export default { listen };
