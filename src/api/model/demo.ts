import { Schema } from 'mongoose'

const DemoSchema = new Schema(
    {
        some_thing: {
            type: String,
        },  
    },
    { timestamps: true }
)

// DemoSchema.index({ some_thing: 1 })
// DemoSchema.index({ auto_remove_at: 1 }, { expireAfterSeconds: 0 })

export const Demo = $database.mongodb.method.use(
    'name_of_db',
    'Demo',
    DemoSchema
)