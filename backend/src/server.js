import connectToDb from './db/db.js';
import { app } from './app.js';
import 'dotenv/config';

connectToDb()
.then( () => {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is listening on port http://localhost:${process.env.PORT}`)
  });
})
.catch((error) => {
  console.log(error);
});

