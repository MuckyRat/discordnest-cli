import axios, { type AxiosInstance } from 'axios';
import chalk from 'chalk';
import { config } from './config.js';

const BASE_URL = 'https://discordnest.xyz/api';

export function createApi(requiresAuth = false): AxiosInstance {
  const apiKey = config.getApiKey();

  if (requiresAuth && !apiKey) {
    console.error(chalk.red('✗ Not authenticated. Run: ') + chalk.white('dn auth login <api-key>'));
    process.exit(1);
  }

  const instance = axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
    },
    timeout: 10_000,
  });

  instance.interceptors.response.use(
    (res) => res.data?.data ?? res.data,
    (err) => {
      const msg = err.response?.data?.message ?? err.message ?? 'Request failed';
      return Promise.reject(new Error(Array.isArray(msg) ? msg.join(', ') : msg));
    },
  );

  return instance;
}
