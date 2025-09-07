import { GetScannerResultParams, ScannerApiResponse } from './basic-types';

export const getScannerData = async (
  params: GetScannerResultParams,
): Promise<ScannerApiResponse> => {
  const queryString = new URLSearchParams();

  Object.entries(params).forEach(([k, v]) => {
    if (Array.isArray(v) && v.length) {
      queryString.set(k, v.join(','));
    } else if (v !== undefined && v !== null) {
      queryString.set(k, String(v));
    }
  });

  try {
    const res = await fetch(`/api/scanner?${queryString.toString()}`);

    return res.json();
  } catch (error) {
    throw new Error(`GET /scanner failed with error: ${error}`);
  }
};
