import { ui } from '@oliveai/ldk';
import definitionLookup from '../../context/definitionLookup';

const handler = async (text) => {
  const regText = new RegExp(`/olive .+`);
  const checkText = regText.test(text);
  // Check to see if user submitted a word preceded by "/define"
  const searchString = checkText ? text.substring(7) : text;

  if (checkText) {
    definitionLookup.lookup(searchString);
  }
};

const listen = () => {
  ui.listenGlobalSearch(handler);
  ui.listenSearchbar(handler);
};

export { handler };
export default { listen };
