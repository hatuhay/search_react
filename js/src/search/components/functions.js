export function safeCSSId (string) {
  return encodeURIComponent(string)
    .toLowerCase()
    .replace(/\.|%[0-9a-z]{2}/gi, '');
}