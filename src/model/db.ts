import mongoose = require('mongoose')

mongoose.Promise = Promise

export async function init(): Promise<void> {
  await mongoose.connect('mongodb://localhost:27017/radar180', { useNewUrlParser: true })
  mongoose.connection.on('error', () => {
    console.error.bind(console, 'connection error:')
  })
  mongoose.connection.once('open', () => {
    console.log('connected to mongodb')
  })
}
