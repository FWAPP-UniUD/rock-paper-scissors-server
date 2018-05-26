import mongoose from 'mongoose';

const user_schema = mongoose.Schema({
    email: { type: String, required: true, match: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i },
    name: { type: String, required: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', user_schema);

export default User;
