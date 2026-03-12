type OutputFormat = 'PNG' | 'JPG' | 'WEBP' | 'AVIF';

type FormatConfig = {
  menuId: string;
  title: string;
  mimeType: string;
  extension: string;
  quality?: number;
};

const MENU_PARENT_ID = 'convertImage';
const FORMAT_CONFIGS: Record<OutputFormat, FormatConfig> = {
  PNG: {
    menuId: 'convertToPNG',
    title: 'Convert to PNG',
    mimeType: 'image/png',
    extension: 'png',
  },
  JPG: {
    menuId: 'convertToJPG',
    title: 'Convert to JPG',
    mimeType: 'image/jpeg',
    extension: 'jpg',
    quality: 0.9,
  },
  WEBP: {
    menuId: 'convertToWEBP',
    title: 'Convert to WEBP',
    mimeType: 'image/webp',
    extension: 'webp',
    quality: 0.9,
  },
  AVIF: {
    menuId: 'convertToAVIF',
    title: 'Convert to AVIF',
    mimeType: 'image/avif',
    extension: 'avif',
    quality: 0.8,
  },
};

const FORMAT_ORDER: OutputFormat[] = ['PNG', 'JPG', 'WEBP', 'AVIF'];
const BASELINE_FORMATS: OutputFormat[] = ['PNG', 'JPG'];
let supportedFormatsCache: OutputFormat[] | null = null;

async function blobToDataUrl(blob: Blob): Promise<string> {
  const buffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return `data:${blob.type};base64,${btoa(binary)}`;
}

async function isMimeTypeSupported(mimeType: string): Promise<boolean> {
  try {
    const canvas = new OffscreenCanvas(1, 1);
    const blob = await canvas.convertToBlob({ type: mimeType, quality: 0.9 });
    return blob.type === mimeType;
  } catch {
    return false;
  }
}

async function getSupportedFormats(): Promise<OutputFormat[]> {
  if (supportedFormatsCache) {
    return supportedFormatsCache;
  }

  const supportedFormats: OutputFormat[] = [...BASELINE_FORMATS];
  for (const format of FORMAT_ORDER) {
    if (BASELINE_FORMATS.includes(format)) {
      continue;
    }

    const formatConfig = FORMAT_CONFIGS[format];
    const isSupported = await isMimeTypeSupported(formatConfig.mimeType);
    if (isSupported) {
      supportedFormats.push(format);
    }
  }

  supportedFormatsCache = supportedFormats;
  return supportedFormatsCache;
}

async function createContextMenus(): Promise<void> {
  await chrome.contextMenus.removeAll();

  const supportedFormats = await getSupportedFormats();

  chrome.contextMenus.create({
    id: MENU_PARENT_ID,
    title: 'Convert Image',
    contexts: ['image'],
  });

  for (const format of supportedFormats) {
    const formatConfig = FORMAT_CONFIGS[format];
    chrome.contextMenus.create({
      id: formatConfig.menuId,
      parentId: MENU_PARENT_ID,
      title: formatConfig.title,
      contexts: ['image'],
    });
  }
}

function getOutputFilename(imageUrl: string, format: OutputFormat): string {
  const extension = FORMAT_CONFIGS[format].extension;

  try {
    const url = new URL(imageUrl);
    const rawName = url.pathname.split('/').pop() || 'image';
    const baseName = rawName.includes('.')
      ? rawName.substring(0, rawName.lastIndexOf('.'))
      : rawName;
    return `${baseName || 'image'}.${extension}`;
  } catch {
    return `image.${extension}`;
  }
}

async function convertAndDownloadImage(imageUrl: string, format: OutputFormat): Promise<void> {
  const formatConfig = FORMAT_CONFIGS[format];
  const outputFilename = getOutputFilename(imageUrl, format);

  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.status}`);
  }

  const sourceBlob = await response.blob();
  const bitmap = await createImageBitmap(sourceBlob);

  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();

  const convertedBlob = await canvas.convertToBlob({
    type: formatConfig.mimeType,
    quality: formatConfig.quality ?? 1,
  });

  if (convertedBlob.type !== formatConfig.mimeType) {
    throw new Error(
      `Requested ${formatConfig.mimeType} but encoder returned ${convertedBlob.type || 'unknown'}`
    );
  }

  console.info('Image converted', {
    requestedFormat: format,
    outputMimeType: convertedBlob.type,
    outputFilename,
  });

  const dataUrl = await blobToDataUrl(convertedBlob);
  await chrome.downloads.download({
    url: dataUrl,
    filename: outputFilename,
    saveAs: false,
  });
}

chrome.runtime.onInstalled.addListener(() => {
  void createContextMenus();
});

chrome.runtime.onStartup.addListener(() => {
  void createContextMenus();
});

chrome.contextMenus.onClicked.addListener((info) => {
  const imageUrl = info.srcUrl;
  if (!imageUrl) {
    return;
  }

  const format = FORMAT_ORDER.find(
    (candidateFormat) => FORMAT_CONFIGS[candidateFormat].menuId === info.menuItemId
  );

  if (!format) {
    return;
  }

  void convertAndDownloadImage(imageUrl, format).catch((error: unknown) => {
    if (error instanceof Error) {
      console.error('Image conversion failed:', error.message);
      return;
    }

    console.error('Image conversion failed:', error);
  });
});

