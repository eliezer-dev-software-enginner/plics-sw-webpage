//app/sitemap.ts
import type { MetadataRoute } from 'next';

import { getBaseUrl } from './lib/common';
import { POLICY_UPDATED_AT } from './politica-de-privacidade/constants';

const MONTHS: Record<string, string> = {
  'janeiro': '01',
  'fevereiro': '02',
  'março': '03',
  'abril': '04',
  'maio': '05',
  'junho': '06',
  'julho': '07',
  'agosto': '08',
  'setembro': '09',
  'outubro': '10',
  'novembro': '11',
  'dezembro': '12',
};

function ptBrDateToDate(value: string) {
  const [day, month, year] = value.split(' de ');
  const monthIndex = MONTHS[month.toLowerCase()];

  if (!day || !monthIndex || !year) {
    return new Date();
  }

  return new Date(Number(year), Number(monthIndex) - 1, Number(day));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();
  const now = new Date();

  return [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/comprar-plics-sw`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/impulsionar-instagram`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/atualizacao`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/politica-de-privacidade`,
      lastModified: ptBrDateToDate(POLICY_UPDATED_AT),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];
}
