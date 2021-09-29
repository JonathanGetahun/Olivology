import { filesystem, network } from '@oliveai/ldk';

const run = async () => {
  const request = {
    method: 'GET',
    url: `https://olivology-assets.oliveai.dev/data/dictionary.json`,
  };

  const response = await network.httpRequest(request);
  const decodedBody = await network.decode(response.body);
  const parsedObject = JSON.parse(decodedBody);

  const dirPath = 'dictionary';
  const writeMode = 0o755;
  const filePath = await filesystem.join([dirPath, 'olivology.txt']);
  const dictionaryDataText = JSON.stringify(parsedObject);
  const encodedValue = await network.encode(dictionaryDataText);

  await filesystem.makeDir(dirPath, writeMode);

  await filesystem.writeFile({
    path: filePath,
    data: encodedValue,
    writeOperation: filesystem.WriteOperation.overwrite,
    writeMode,
  });
};

export default { run };
