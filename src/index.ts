import dotenv from 'dotenv';
import createServer from './server';
import { dbConnection } from './database';

dotenv.config();
const app = createServer();
const port = process.env.PORT || 4000;

const start = async (): Promise<void> => {
  try {
    // Database connection
    await dbConnection.sync();
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

void start();

export default app;
