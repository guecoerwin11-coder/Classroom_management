const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: {type: String, required: true, trim: true},
    lastName: {type: String, required: true, trim: true},
    email: {type: String, required: true, unique: true, trim: true},
    role: {type: String, enum: ["Teacher", "Student"], default: "Student", required: true},
    password: {type: String, required: true, min: 6, max: 16}
}, {
    timestamps: true
})

const User = mongoose.model('User', userSchema);

module.exports = User;