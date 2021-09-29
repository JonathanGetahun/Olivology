import { OlivologyWhisper } from './whispers';
import { clipboardListener, olivologyExample } from './aptitudes';
import definitions from './context/definitions';

definitions.run();
clipboardListener.listen();
olivologyExample.listen();

new OlivologyWhisper().instructions();
