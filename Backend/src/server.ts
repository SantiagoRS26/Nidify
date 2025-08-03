import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT ?? 3000;

app.get('/', (_req: Request, res: Response) => {
  res.send('Nidify API');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
