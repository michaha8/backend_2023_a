import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    refresh_tokens:{
        type: [String]
    }
})

export = mongoose.model('User',userSchema)

