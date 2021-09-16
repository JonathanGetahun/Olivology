import { keyboard } from '@oliveai/ldk';

import { KeyboardWhisper } from '../../whispers';

const handler = (text) => {
  const whisper = new KeyboardWhisper(text);
  whisper.show();
};
const listen = () => {
  keyboard.listenText(handler);
};

export { handler };
export default { listen };
