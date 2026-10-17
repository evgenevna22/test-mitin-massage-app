import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import slotsRender from './routes/client/slots';
import masterRender from './routes/master/master';
import roleRender from './routes/role';
import { registerBotHandlers } from './telegram/handlers';

registerBotHandlers();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://192.168.1.95:5173',
      'https://test-mitin-massage-app.vercel.app',
    ],
  })
);
app.use('/slots', slotsRender);
app.use('/master', masterRender);
app.use('/role', roleRender);

app.get('/', (_, res) => {
  res.send('Server is working');
});

app.get('/health', (_, res) => {
  res.json({
    status: 'ok',
  });
});

// app.post('/webhook', (req, res) => {
//   bot.processUpdate(req.body)
//   res.sendStatus(200)
// })

const PORT = process.env.PORT || 2222;
app.listen(PORT, () => {
  console.log(`Server is processing on ${PORT} port`);
});
