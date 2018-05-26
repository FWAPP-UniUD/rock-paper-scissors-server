import mongoose from 'mongoose';
import md5 from 'md5';
import User from './user';

mongoose.connect("mongodb://localhost/rps");

User.collection.drop(); // deletes the users collection
User.create([{
    email: "test@example.com",
    name: "Test Account",
    password: md5("test")
}]).then(users => {
    console.log(`${users.length} users created`);
}).catch((err) => {
    console.log(err);
}).finally(() => {
    mongoose.connection.close();
});

