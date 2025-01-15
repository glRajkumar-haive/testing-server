import type { Context } from "hono";
import axios from "axios";
import ogs from 'open-graph-scraper';
import 'dotenv/config';

export async function getOnlineContent(c: Context) {
  const query = c.req.query('query')

  if (!query || typeof query !== 'string') {
    return c.json({ error: 'Search query is required' }, 400);
  }

  try {
    const payload = {
      q: query,
      gl: 'in'
    }

    const headers = {
      'X-API-KEY': process.env.SERPER_KEY,
      'Content-Type': 'application/json'
    }

    const { data } = await axios.post('https://google.serper.dev/search', payload, {
      headers
    })

    const result = data?.organic?.map((d: any) => ({
      href: d?.link,
      body: d?.snippet,
    }))

    return c.json(result)

  } catch (searchError) {
    return c.json({ message: 'Failed to fetch search results' }, 500)
  }
}

export async function getUrlMetadata(c: Context) {
  const url = c.req.query('url')

  if (!url) return c.json({ error: 'No URL provided' }, 400)

  const decoded = decodeURIComponent(url)
  const { result, error } = await ogs({ url: decoded })

  if (error) return c.json({})

  let baseUrl = result?.ogUrl ? new URL(result?.ogUrl) : {} as any

  let payload = {
    title: result?.ogTitle || result?.twitterTitle,
    description: result?.ogDescription || result?.twitterDescription,
    siteName: result?.ogSiteName || baseUrl?.hostname,
    favicon: result?.favicon ?
      !result?.favicon?.startsWith("http") ? baseUrl?.origin + result?.favicon : result?.favicon
      : result?.ogImage?.[0]?.url || "",
  }

  return c.json(payload)
}
