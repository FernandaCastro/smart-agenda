const app = require('./app').default;
const { connectToDatabase } = require('./database');
const dotenv = require('dotenv');

//Configure Environment Variables
dotenv.config();

const PORT: number = process.env.PORT ? Number(process.env.PORT) : 5001;

connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}).catch((err: any) => {
  console.error('❌ Failed to connect to the database:', err);
});
;

