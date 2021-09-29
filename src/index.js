import { OlivologyWhisper } from './whispers';
import { clipboardListener, olivologyStart } from './aptitudes';
import definitions from './context/definitions';

definitions.run();
clipboardListener.listen();
olivologyStart.listen();

new OlivologyWhisper().instructions();
