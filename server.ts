import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const KOBIS_API_KEY = process.env.KOBIS_API_KEY || 'b2f34913debc987db5f3b27c6e18099a';

  app.use(express.json());

  // KOBIS Daily Box Office API proxy
  app.get('/api/boxoffice', async (req, res) => {
    try {
      const { targetDt, multiMovieYn, repNationCd, itemPerPage } = req.query;
      if (!targetDt || typeof targetDt !== 'string') {
        return res.status(400).json({ error: 'targetDt 파라미터가 필요합니다. (YYYYMMDD 또는 YYYY-MM-DD)' });
      }

      const formattedDt = targetDt.replace(/-/g, '').trim();
      const params = new URLSearchParams({
        key: KOBIS_API_KEY,
        targetDt: formattedDt,
      });

      if (multiMovieYn && typeof multiMovieYn === 'string' && multiMovieYn !== 'ALL') {
        params.append('multiMovieYn', multiMovieYn);
      }
      if (repNationCd && typeof repNationCd === 'string' && repNationCd !== 'ALL') {
        params.append('repNationCd', repNationCd);
      }
      if (itemPerPage && typeof itemPerPage === 'string') {
        params.append('itemPerPage', itemPerPage);
      }

      const apiUrl = `http://kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?${params.toString()}`;
      const response = await fetch(apiUrl);
      if (!response.ok) {
        return res.status(response.status).json({ error: `KOBIS API 통신 실패 (${response.statusText})` });
      }

      const data = await response.json();
      return res.json(data);
    } catch (error: any) {
      console.error('박스오피스 조회 중 에러:', error);
      return res.status(500).json({ error: error.message || '서버 오류가 발생했습니다.' });
    }
  });

  // KOBIS Movie Detail Info API proxy
  app.get('/api/movie-info', async (req, res) => {
    try {
      const { movieCd } = req.query;
      if (!movieCd || typeof movieCd !== 'string') {
        return res.status(400).json({ error: 'movieCd 영화코드가 필요합니다.' });
      }

      const params = new URLSearchParams({
        key: KOBIS_API_KEY,
        movieCd: movieCd.trim(),
      });

      const apiUrl = `http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json?${params.toString()}`;
      const response = await fetch(apiUrl);
      if (!response.ok) {
        return res.status(response.status).json({ error: `KOBIS API 통신 실패 (${response.statusText})` });
      }

      const data = await response.json();
      return res.json(data);
    } catch (error: any) {
      console.error('영화 상세정보 조회 중 에러:', error);
      return res.status(500).json({ error: error.message || '서버 오류가 발생했습니다.' });
    }
  });

  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
