import type { Request, Response } from 'express';
import languageService from './language.service.js';

async function getGoogleSupportedLanguages(req: Request, res: Response) {
  const { q } = req.query;
  const query = typeof q === 'string' ? q : undefined;
  const languages = await languageService.getGoogleSupportedLanguages(query);

  res.status(200).json({
    data: {
      languages,
      length: languages.length,
    },
  });
}

export default { getGoogleSupportedLanguages };
