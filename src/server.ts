import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env, assertEnv } from './config/env';
import routes from './routes';

assertEnv();

const app = express();

app.use(helmet());
app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());

app.use('/api', routes);

app.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${env.port}`);
});


