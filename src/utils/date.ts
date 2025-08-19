export function getCurrentISODate(): string {
  return new Date().toISOString();
}


export const formatIsoToCustom = (iso: string): string => {
  const date = new Date(iso);
  const [yyyy, mm, dd] = date.toISOString().split('T')[0].split('-');
  const [hh, min, ss] = date.toTimeString().split(':');
  return `${yyyy}-${mm}-${dd} / ${hh}:${min}:${ss}`;
};

export function formatDateTime(isoString: string): string {
  const date = new Date(isoString);

  // Formateamos fecha
  const fecha = date.toISOString().split('T')[0]; // "2025-08-16"

  // Formateamos hora manualmente para eliminar los milisegundos
  const horaCompleta = date.toTimeString().split(' ')[0]; // "21:07:06"

  return `${fecha} / ${horaCompleta}`;
}