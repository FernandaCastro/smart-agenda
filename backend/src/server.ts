import app from './app';

const PORT: number = process.env.PORT ? Number(process.env.PORT) : 5001;

app.listen(PORT, () => {
  console.log(`Server is running at http://0.0.0.0:${PORT}`);
});
