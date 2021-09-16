import {
  clipboardListener,
  filesystemExample,
  keyboardListener,
  networkExample,
  searchListener,
  activeWindowListener,
} from './aptitudes';

jest.mock('./aptitudes');
jest.mock('@oliveai/ldk');

const mockIntroShow = jest.fn();
jest.mock('./whispers', () => {
  return {
    IntroWhisper: jest.fn().mockImplementation(() => {
      return { show: mockIntroShow };
    }),
  };
});

describe('Project Startup', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should start the Intro whisper and all active aptitudes on startup', () => {
    // eslint-disable-next-line global-require
    require('.');

    expect(mockIntroShow).toBeCalled();
    expect(clipboardListener.listen).toBeCalled();
    expect(filesystemExample.run).toBeCalled();
    expect(keyboardListener.listen).toBeCalled();
    expect(networkExample.run).toBeCalled();
    expect(searchListener.listen).toBeCalled();
    expect(activeWindowListener.listen).toBeCalled();
  });
});
