import pako from "pako";

function encode6bit(b: number): string {
  if (b < 10) return String.fromCharCode(48 + b);
  b -= 10;
  if (b < 26) return String.fromCharCode(65 + b);
  b -= 26;
  if (b < 26) return String.fromCharCode(97 + b);
  b -= 26;
  if (b === 0) return "-";
  if (b === 1) return "_";
  return "?";
}

function append3bytes(b1: number, b2: number, b3: number): string {
  const c1 = b1 >> 2;
  const c2 = ((b1 & 0x3) << 4) | (b2 >> 4);
  const c3 = ((b2 & 0xf) << 2) | (b3 >> 6);
  const c4 = b3 & 0x3f;
  return encode6bit(c1) + encode6bit(c2) + encode6bit(c3) + encode6bit(c4);
}

function encodePlantUML(plantUmlText: string) {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(plantUmlText);
  const compressed = pako.deflate(bytes, { level: 9, raw: true });

  let result = "";
  for (let i = 0; i < compressed.length; i += 3) {
    if (i + 2 === compressed.length) {
      result += append3bytes(compressed[i]!, compressed[i + 1]!, 0);
    } else if (i + 1 === compressed.length) {
      result += append3bytes(compressed[i]!, 0, 0);
    } else {
      result += append3bytes(
        compressed[i]!,
        compressed[i + 1]!,
        compressed[i + 2]!,
      );
    }
  }
  return result;
}

export function generatePlantUMLUrl(
  plantUmlText: string,
  darkMode: boolean = false,
) {
  const encoded = encodePlantUML(plantUmlText);
  return `https://www.plantuml.com/plantuml/${darkMode ? "d" : ""}svg/${encoded}`;
}

export function generateTextPlantUMLUrl(plantUmlText: string) {
  const encoded = encodePlantUML(plantUmlText);
  return `https://www.plantuml.com/plantuml/txt/${encoded}`;
}
