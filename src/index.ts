import * as dotenv from 'dotenv';
const envFile = process.env.NODE_ENV === 'test'  ? '.env.test' : '.env';
dotenv.config({ path: envFile });
import { App } from './app';


const appInstance = new App();
// Start the server
const PORT = process.env.PORT || 3000;
appInstance.app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
