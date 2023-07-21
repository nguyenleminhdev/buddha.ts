import { Schema } from 'mongoose'
import { md5_id } from '../service/generate'
import { create_model_mongodb } from 'buddha-core'

const TestSchema = new Schema(
    {
        test_id: {
            type: String,
            default: md5_id,
            unique: true,
            sparse: true,
        },
    },
    { timestamps: true }
)

TestSchema.index({ test_id: 1 }, { unique: true, sparse: true, })

export const UserFacebookAccount = create_model_mongodb(
    'db_1',
    'Test',
    TestSchema
)
