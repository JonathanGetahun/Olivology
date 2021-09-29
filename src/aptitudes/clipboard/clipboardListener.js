import { clipboard } from '@oliveai/ldk';
import definitionLookup from '../../context/definitionLookup';

const handler = async (text) => {
  if (text) {
    definitionLookup.lookup(text);
  }
};

const listen = () => {
  clipboard.listen(false, handler);
};

export { handler };
export default { listen };
