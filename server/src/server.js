import 'dotenv/config';
import app from './app.js';
import sequelize from './db/db.js';
console.log('JWT Secret on Start:', process.env.JWT_SECRET);

const PORT = process.env.PORT || 3001;

sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`SERVER IS LISTENING AT ${PORT}`);

    } );



});
