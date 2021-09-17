import { OlivologyWhisper, IntroWhisper } from './whispers';
import {
  clipboardListener,
  filesystemExample,
  networkExample,
  olivologyExample,
} from './aptitudes';

clipboardListener.listen();
filesystemExample.run();
networkExample.run();
olivologyExample.listen();

new OlivologyWhisper().instructions();
new IntroWhisper().show();
