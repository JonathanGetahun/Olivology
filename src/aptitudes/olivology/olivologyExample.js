import { ui, filesystem, network } from '@oliveai/ldk';

import { pluralize } from '@looop/pluralize';
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

const add = async (addWord, addDef) => {
  const dirPath = 'dictionary';
  const writeMode = 0o755;
  const filePath = await filesystem.join([dirPath, 'olivology.txt']);
  const encodedFileContents = await filesystem.readFile(filePath);
  const fileContents = await network.decode(encodedFileContents);
  const fileContentsJson = JSON.parse(fileContents);
  const foundWord = { word: addWord, definition: addDef };

  // If word exists in dictionary add, otherwise notify user of duplicate
  if (!(addWord in fileContentsJson)) {
    fileContentsJson[`${addWord}`] = addDef;
    const finalDataText = JSON.stringify(fileContentsJson);
    const addEncodedValue = await network.encode(finalDataText);

    await filesystem.remove(dirPath);
    await filesystem.makeDir(dirPath, writeMode);

    await filesystem.writeFile({
      path: filePath,
      data: addEncodedValue,
      writeOperation: filesystem.WriteOperation.overwrite,
      writeMode,
    });

    const whisper = new OlivologyWhisper(foundWord);
    whisper.addedWord();
  } else {
    const whisper = new OlivologyWhisper(foundWord);
    whisper.doubleWord();
  }
};

const deleteWord = async (delWord) => {
  const dirPath = 'dictionary';
  const writeMode = 0o755;
  const filePath = await filesystem.join([dirPath, 'olivology.txt']);
  const encodedFileContents = await filesystem.readFile(filePath);
  const fileContents = await network.decode(encodedFileContents);
  const fileContentsJson = JSON.parse(fileContents);
  const foundWord = { word: delWord };

  // If the word exists in dictionary delete, otherwise inform user no deletion occurred.
  if (delWord in fileContentsJson) {
    delete fileContentsJson[`${delWord}`];

    const finalDataText = JSON.stringify(fileContentsJson);
    const addEncodedValue = await network.encode(finalDataText);

    await filesystem.remove(dirPath);
    await filesystem.makeDir(dirPath, writeMode);

    await filesystem.writeFile({
      path: filePath,
      data: addEncodedValue,
      writeOperation: filesystem.WriteOperation.overwrite,
      writeMode,
    });

    const whisper = new OlivologyWhisper(foundWord);
    whisper.delWord();
  } else {
    const whisper = new OlivologyWhisper(foundWord);
    whisper.delWordFail();
  }
};

const editWord = async (editedWord, editDef) => {
  const dirPath = 'dictionary';
  const writeMode = 0o755;
  const filePath = await filesystem.join([dirPath, 'olivology.txt']);
  const encodedFileContents = await filesystem.readFile(filePath);
  const fileContents = await network.decode(encodedFileContents);
  const fileContentsJson = JSON.parse(fileContents);
  const foundWord = { word: editedWord, definition: editDef };

  await filesystem.remove(dirPath);
  await filesystem.makeDir(dirPath, writeMode);

  // If word exists in dictionary add, otherwise notify user of duplicate
  if (editedWord in fileContentsJson && editDef) {
    fileContentsJson[`${editedWord}`] = editDef;
    const finalDataText = JSON.stringify(fileContentsJson);
    const addEncodedValue = await network.encode(finalDataText);

    await filesystem.writeFile({
      path: filePath,
      data: addEncodedValue,
      writeOperation: filesystem.WriteOperation.overwrite,
      writeMode,
    });

    const whisper = new OlivologyWhisper(foundWord);
    whisper.editWords();
  } else {
    const whisper = new OlivologyWhisper(foundWord);
    if (editWord) whisper.editWordFail();
    else whisper.editWordNoDef();
  }
};

const importList = async () => {};

const exportList = async () => {
  const dirPath = 'dictionary';
  const writeMode = 0o755;
  const filePath = await filesystem.join([dirPath, 'olivology.txt']);
  const encodedFileContents = await filesystem.readFile(filePath);

  const exportDirPath = '/Users/jonathangetahun/Desktop/exportedOlivology';
  const exportFilePath = await filesystem.join([exportDirPath, 'olivology.txt']);

  if (!(await filesystem.exists(exportDirPath))) {
    await filesystem.makeDir(exportDirPath, writeMode);
  }

  await filesystem.writeFile({
    path: exportFilePath,
    data: encodedFileContents,
    writeOperation: filesystem.WriteOperation.overwrite,
    writeMode,
  });

  const whisper = new OlivologyWhisper();
  whisper.exportList();
};

export { handler, add, deleteWord, editWord, importList, exportList };
export default { listen };
