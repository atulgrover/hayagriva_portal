import crypto from 'crypto';

export interface ManifestFileEntry {
  name?: string;
  path: string;
  content: string;
  sha256?: string;
}

export interface DeltaSyncResult {
  hasUpdates: boolean;
  updatedFiles: ManifestFileEntry[];
  deletedFiles: string[];
  unchangedFilesCount: number;
}

export function computeSha256(content: string): string {
  return crypto.createHash('sha256').update(content || '', 'utf8').digest('hex');
}

/**
 * Compares server canonical files with client-provided hash map.
 * Returns only updated/added files and a list of deleted files.
 */
export function calculateFileDiff(
  serverFiles: ManifestFileEntry[],
  clientHashes: Record<string, string> = {}
): DeltaSyncResult {
  const updatedFiles: ManifestFileEntry[] = [];
  const serverPathSet = new Set<string>();
  let unchangedFilesCount = 0;

  for (const file of serverFiles) {
    const filePath = file.path || file.name || 'file';
    serverPathSet.add(filePath);

    const serverHash = file.sha256 || computeSha256(file.content);
    const clientHash = clientHashes[filePath];

    if (!clientHash || clientHash !== serverHash) {
      updatedFiles.push({
        name: file.name || filePath,
        path: filePath,
        content: file.content,
        sha256: serverHash,
      });
    } else {
      unchangedFilesCount++;
    }
  }

  // Any file in client's hash map that is no longer on server is marked for deletion
  const deletedFiles: string[] = [];
  for (const clientFilePath of Object.keys(clientHashes)) {
    if (!serverPathSet.has(clientFilePath)) {
      deletedFiles.push(clientFilePath);
    }
  }

  const hasUpdates = updatedFiles.length > 0 || deletedFiles.length > 0;

  return {
    hasUpdates,
    updatedFiles,
    deletedFiles,
    unchangedFilesCount,
  };
}
