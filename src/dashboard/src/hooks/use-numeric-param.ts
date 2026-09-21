import { useParams } from 'react-router-dom';

export function useNumericParam(name: string): number | null {
  const params = useParams();

  const value = Number(params[name]);

  return Number.isInteger(value) && value > 0 ? value : null;
}
