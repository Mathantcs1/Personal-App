export interface UrlMetadata {
  title: string;
  description?: string;
  imageUrl?: string;
  favicon?: string;
}

export async function fetchUrlMetadata(url: string): Promise<UrlMetadata> {
  try {
    const ogs = await import("open-graph-scraper");
    const { result } = await ogs.default({ url, timeout: 5000 });
    const title = result.ogTitle || result.twitterTitle || new URL(url).hostname;
    const description = result.ogDescription || result.twitterDescription;
    const imageUrl = result.ogImage?.[0]?.url || result.twitterImage?.[0]?.url;
    const favicon = `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=32`;
    return { title, description, imageUrl, favicon };
  } catch {
    const hostname = new URL(url).hostname;
    return {
      title: hostname,
      favicon: `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`,
    };
  }
}
