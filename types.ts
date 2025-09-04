
export interface UploadedFile {
  id: string;
  file: File;
  preview: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
