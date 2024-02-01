export function getNamePrefix(name: string | null | undefined) {
  // Filter only alphabets in Thai and English then return the first letter
  if (name) {
    return name
      .replace(/[^ก-๙a-zA-Z]/g, "")
      .charAt(0)
      .toUpperCase();
  }
  return "";
}
