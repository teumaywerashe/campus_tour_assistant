import express, { Application } from 'express';
import cors from 'cors';
import path from 'path';

class Server {
  app: Application;
  port: number | string;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.app.use('/uploads', express.static('uploads'));
    this.middlewares();
  }

  middlewares(): void {
    this.app.use(cors());
  }

  listen(): void {
    this.app.listen(this.port, () => {
      console.log('server running on port: ', this.port);
    });
  }
}

export default Server;
