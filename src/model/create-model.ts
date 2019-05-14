// library imports
import { connection, model, Schema } from 'mongoose'

// project imports
import { init } from './db'
init()

export default function createModel(modelName: string, schemaDefinition: any, decorator?: (schema: Schema) => void) {
  const schema = new Schema(schemaDefinition, {
    id: false,
  })
  decorator && decorator(schema)
  return model(modelName, schema)
}
