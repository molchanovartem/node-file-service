import { Server } from './Server'
import * as fs from 'fs'

import config from './config/environment.config'

async function main() {
  if (!fs.existsSync(config.uploadFolder)) {
    fs.mkdirSync(config.uploadFolder)
  }

  const server = new Server(config.port)
  await server.listen()
}

main()
