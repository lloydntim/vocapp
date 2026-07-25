import type { Request, Response } from 'express';
import { NoParams } from '../../shared/types/index.js';
import languageService from './language.service.js';

export interface TranslationResponse {
  data: {
    translatedText: string | null | undefined;
  };
}

async function getGoogleSupportedLanguages(req: Request, res: Response) {
  const { q } = req.query as { q?: string };
  const languages = await languageService.getGoogleSupportedLanguages(q);

  res.status(200).json({
    data: {
      languages,
      length: languages.length,
    },
  });
}

async function getTranslations(
  req: Request<NoParams, TranslationResponse>,
  res: Response<TranslationResponse>,
) {
  const { translatedText } = await languageService.getTranslations(req.body);

  res.status(200).json({
    data: {
      translatedText,
    },
  });
}

export default { getGoogleSupportedLanguages, getTranslations };
