import { OlivologyWhisper } from './whispers';
import { filesystemExample, networkExample, olivologyExample } from './aptitudes';

filesystemExample.run();
networkExample.run();
olivologyExample.listen();

new OlivologyWhisper().instructions();
