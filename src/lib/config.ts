import Conf from 'conf';

const store = new Conf<{ apiKey?: string }>({ projectName: 'discordnest-cli' });

export const config = {
  getApiKey: (): string | undefined => store.get('apiKey'),
  setApiKey: (key: string): void => { store.set('apiKey', key); },
  clearApiKey: (): void => { store.delete('apiKey'); },
  path: store.path,
};
