import { createApp } from './app';
import { config } from './config';

const app = createApp();

app.listen(config.serverPort, () => {
  console.log(`Backend listening on http://localhost:${config.serverPort}`);
});
