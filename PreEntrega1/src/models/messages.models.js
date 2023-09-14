import { Schema, model } from "mongoose";

const messageSchema = new Schema
(
    {
        message:
        {
            type: String,
            required: true
        }
    }
)

const messageModel = model('messages', messageSchema)
export default messageModel