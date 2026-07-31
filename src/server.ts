import { env } from './config/env';
import { connectMongo } from './config/mongoose';
import app from './app';

app.listen(env.PORT, () => {
    connectMongo();
    console.log(`Servidor rodando: http://localhost:${env.PORT}/docs`);
});