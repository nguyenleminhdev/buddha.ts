import { Schema } from 'mongoose'

const DemoSchema = new Schema(
    {
        field_one: {
            type: String,
            required: true,
            unique: true,
            sparse: true
        },
        auto_remove_at: {
            type: Date,
            required: true
        },
    },
    { timestamps: true }
)

DemoSchema.index({ field_one: 1 }, { unique: true, sparse: true })
DemoSchema.index({ auto_remove_at: 1 }, { expireAfterSeconds: 0 })

export const Demo = $database.mongodb.method.use(
    'chatbox_2_main_data',
    'Demo',
    DemoSchema
)