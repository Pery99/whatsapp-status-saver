export interface StatusFile {
  id: string;
  uri: string;
  name: string;
  type: 'image' | 'video';
  size: number;
  timestamp: number;
}

export interface DownloadResult {
  success: boolean;
  savedPath?: string;
  error?: string;
}
