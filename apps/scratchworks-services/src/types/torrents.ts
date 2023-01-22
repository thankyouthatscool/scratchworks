export type Torrent = {
  downloadedEver: number;
  hashString: string;
  id: number;
  name: string;
  percentComplete: number;
  percentDone: number;
  rateDownload: number;
  rateUpload: number;
  status: number;
  totalSize: number;
};
