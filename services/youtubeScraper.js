import axios from 'axios';
import cheerio from 'cheerio';

export async function searchYouTubeVideosScraper(query) {
  try {
    // Faz a requisição para a página de resultados do YouTube
    const response = await axios.get(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`);
    const htmlContent = response.data;

    // Usa cheerio para parsear o HTML
    const $ = cheerio.load(htmlContent);

    const videos = [];
    $('a').each((_, element) => {
      const href = $(element).attr('href');
      if (href && href.startsWith('/watch')) {
        const videoId = href.split('=')[1];
        const title = $(element).text().trim();
        videos.push({
          id: videoId,
          title: title,
          thumbnail: `https://img.youtube.com/vi/${videoId}/0.jpg`,
        });

        if (videos.length >= 5) return false; // Limita a 5 vídeos
      }
    });

    return videos;
  } catch (error) {
    console.error('Erro ao buscar vídeos:', error.message);
    return [];
  }
}
