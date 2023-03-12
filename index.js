import http from 'http'

import { app } from './app.js'
import { PORT } from './utils/config.js'
import { info } from './utils/logger.js'

export const server = http.createServer(app)

server.listen(PORT, () => {
  info(`Server running on port ${PORT}`)
})
