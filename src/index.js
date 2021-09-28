import { OlivologyWhisper } from './whispers';
import { clipboardListener, olivologyExample } from './aptitudes';

clipboardListener.listen();
olivologyExample.listen();

new OlivologyWhisper().instructions();
