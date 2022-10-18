import app from "./app";
import { dbSetup } from "./db";
import * as dotenv from 'dotenv';

dotenv.config();


async function main() {
    try {
        await dbSetup();
        app.listen(3001);
        console.log('el server anda corriendo fachero facherito');
    } catch (error) {
        console.log('ups....', error)
    }
}


main();