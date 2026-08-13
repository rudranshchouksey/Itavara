interface UploadMediaOptions {
  file: File;
  uploadUrl: string;
  onProgress?: (progressEvent: ProgressEvent) => void;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

/**
 * Uploads a file to a pre-signed URL (e.g., S3 or R2) using XMLHttpRequest
 * to support client-side progress tracking which standard fetch does not natively support.
 */
export const uploadMediaWithProgress = ({
  file,
  uploadUrl,
  onProgress,
  onSuccess,
  onError,
}: UploadMediaOptions): XMLHttpRequest => {
  const xhr = new XMLHttpRequest();

  xhr.open('PUT', uploadUrl, true);
  xhr.setRequestHeader('Content-Type', file.type);

  // Track upload progress
  if (xhr.upload && onProgress) {
    xhr.upload.onprogress = (event) => {
      onProgress(event);
    };
  }

  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      if (onSuccess) onSuccess();
    } else {
      if (onError) onError(new Error(`Upload failed with status ${xhr.status}`));
    }
  };

  xhr.onerror = () => {
    if (onError) onError(new Error('Network error occurred during upload.'));
  };

  xhr.send(file);

  // Return xhr object so caller can call xhr.abort() if they want to cancel
  return xhr;
};
