import { ui, filesystem, network } from '@oliveai/ldk';

import { OlivologyWhisper } from '../../whispers';
import dictData from '../../assets/dictionary.json';

const handler = async (text) => {
  const regText = new RegExp(`/define .+`);
  const checkText = regText.test(text);
  const dirPath = 'dictionary';
  const searchString = checkText ? text.substring(8) : text;
  const writeMode = 0o755;
  const filePath = await filesystem.join([dirPath, 'olivology.txt']);
  const dictDataText = JSON.stringify(dictData);
  const encodedValue = await network.encode(dictDataText);

  // Check to see if user submitted a word preceded by "/define"
  if (checkText) {
    // If directory doesn't exist make a new one
    if (!(await filesystem.exists(dirPath))) {
      await filesystem.makeDir(dirPath, writeMode);

      await filesystem.writeFile({
        path: filePath,
        data: encodedValue,
        writeOperation: filesystem.WriteOperation.overwrite,
        writeMode,
      });
    }

    // Check if word searched is in the dictionary
    const encodedFileContents = await filesystem.readFile(filePath);
    const fileContents = await network.decode(encodedFileContents);
    const fileContentsJson = JSON.parse(fileContents);
    const words = Object.keys(fileContentsJson);

    if (words.includes(searchString)) {
      const foundWord = { word: searchString, definition: fileContentsJson[`${searchString}`] };
      const whisper = new OlivologyWhisper(foundWord);
      whisper.show();
    } else {
      const whisper = new OlivologyWhisper(null);
      whisper.show();
    }
  }
};
const listen = () => {
  ui.listenGlobalSearch(handler);
  ui.listenSearchbar(handler);
};

export { handler };
export default { listen };
