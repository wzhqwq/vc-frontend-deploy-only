export function removeHtmlTags(html: string): string {
  return html.replace(/(<([^>]+)>)/gi, "");
}
export function less(text: string, length = 100): string {
  return text.length > length ? text.slice(0, length) + "..." : text;
}
