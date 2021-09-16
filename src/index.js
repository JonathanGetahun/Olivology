import { IntroWhisper } from './whispers';
import {
  clipboardListener,
  filesystemExample,
  keyboardListener,
  networkExample,
  searchListener,
  activeWindowListener,
} from './aptitudes';

clipboardListener.listen();
filesystemExample.run();
keyboardListener.listen();
networkExample.run();
searchListener.listen();
activeWindowListener.listen();

new IntroWhisper().show();
