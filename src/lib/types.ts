export type Karya = {
  id: string;
  user_id: string;
  title: string;
  url: string;
  participant_name: string;
  created_at: string;
  updated_at: string;
};

export function thumbnailUrl(websiteUrl: string, width = 800, height = 600) {
  const encoded = encodeURIComponent(websiteUrl);
  return `https://s.wordpress.com/mshots/v1/${encoded}?w=${width}&h=${height}`;
}
