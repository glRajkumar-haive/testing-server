import { serve } from '@hono/node-server';

import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { Hono } from 'hono';
import 'dotenv/config';
import { getOnlineContent, getUrlMetadata } from './general';

const app = new Hono().basePath("api")

app.use(logger())
app.use(cors())

app.get("/health", c => c.json({ status: "ok" }))

app.get('/general/web-search', getOnlineContent)
app.get('/general/url-meta-data', getUrlMetadata)


app.notFound(c => c.json({ message: 'Route not found' }, 404))

app.onError((err, c) => {
  console.log(err)
  return c.json({ message: err.message || "Internal sever eror" }, 500)
})

const port = Number(process.env.PORT || 5000)
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
