export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const KOBIS_API_KEY = process.env.KOBIS_API_KEY || 'b2f34913debc987db5f3b27c6e18099a';
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
    return res.status(200).json(data);
  } catch (error: any) {
    console.error('박스오피스 조회 중 에러:', error);
    return res.status(500).json({ error: error.message || '서버 오류가 발생했습니다.' });
  }
}
