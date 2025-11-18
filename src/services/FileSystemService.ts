import RNFS from "react-native-fs";
import { Platform } from "react-native";
import { StatusFile, DownloadResult } from "@/types";

export class FileSystemService {
  private static readonly WHATSAPP_STATUS_PATH =
    Platform.OS === "android"
      ? "/storage/emulated/0/Android/media/com.whatsapp/WhatsApp/Media/.Statuses"
      : "";

  private static readonly WHATSAPP_BUSINESS_STATUS_PATH =
    Platform.OS === "android"
      ? "/storage/emulated/0/Android/media/com.whatsapp.w4b/WhatsApp Business/Media/.Statuses"
      : "";

  private static readonly DOWNLOAD_FOLDER = `${RNFS.DownloadDirectoryPath}/WhatsAppDownloader`;

  /**
   * Initialize the download folder
   */
  static async initializeDownloadFolder(): Promise<void> {
    try {
      const exists = await RNFS.exists(this.DOWNLOAD_FOLDER);
      if (!exists) {
        await RNFS.mkdir(this.DOWNLOAD_FOLDER);
        console.log("Download folder created:", this.DOWNLOAD_FOLDER);
      }
    } catch (error) {
      console.error("Error creating download folder:", error);
      throw error;
    }
  }

  /**
   * Check if WhatsApp status directory exists
   */
  static async checkWhatsAppStatusExists(): Promise<boolean> {
    try {
      const mainExists = await RNFS.exists(this.WHATSAPP_STATUS_PATH);
      const businessExists = await RNFS.exists(
        this.WHATSAPP_BUSINESS_STATUS_PATH
      );
      return mainExists || businessExists;
    } catch (error) {
      console.error("Error checking WhatsApp status folder:", error);
      return false;
    }
  }

  /**
   * Scan WhatsApp status folder and return all status files
   */
  static async scanStatusFiles(): Promise<StatusFile[]> {
    const statusFiles: StatusFile[] = [];

    try {
      // Scan main WhatsApp
      const mainExists = await RNFS.exists(this.WHATSAPP_STATUS_PATH);
      if (mainExists) {
        const mainFiles = await this.readStatusDirectory(
          this.WHATSAPP_STATUS_PATH
        );
        statusFiles.push(...mainFiles);
      }

      // Scan WhatsApp Business
      const businessExists = await RNFS.exists(
        this.WHATSAPP_BUSINESS_STATUS_PATH
      );
      if (businessExists) {
        const businessFiles = await this.readStatusDirectory(
          this.WHATSAPP_BUSINESS_STATUS_PATH
        );
        statusFiles.push(...businessFiles);
      }

      // Sort by timestamp (newest first)
      return statusFiles.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error("Error scanning status files:", error);
      return [];
    }
  }

  /**
   * Read files from a specific directory
   */
  private static async readStatusDirectory(
    path: string
  ): Promise<StatusFile[]> {
    try {
      const files = await RNFS.readDir(path);
      const statusFiles: StatusFile[] = [];

      for (const file of files) {
        // Skip .nomedia file and directories
        if (file.name === ".nomedia" || file.isDirectory()) {
          continue;
        }

        const extension = file.name.split(".").pop()?.toLowerCase();
        let type: "image" | "video" | null = null;

        // Determine file type
        if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension || "")) {
          type = "image";
        } else if (
          ["mp4", "mkv", "avi", "mov", "3gp"].includes(extension || "")
        ) {
          type = "video";
        }

        if (type) {
          statusFiles.push({
            id: `${file.path}_${file.mtime}`,
            uri: `file://${file.path}`,
            name: file.name,
            type,
            size: file.size,
            timestamp: file.mtime ? new Date(file.mtime).getTime() : Date.now(),
          });
        }
      }

      return statusFiles;
    } catch (error) {
      console.error(`Error reading directory ${path}:`, error);
      return [];
    }
  }

  /**
   * Download a single status file
   */
  static async downloadStatus(status: StatusFile): Promise<DownloadResult> {
    try {
      await this.initializeDownloadFolder();

      const timestamp = new Date().getTime();
      const fileName = `Status_${timestamp}_${status.name}`;
      const destinationPath = `${this.DOWNLOAD_FOLDER}/${fileName}`;

      // Copy file
      const sourcePath = status.uri.replace("file://", "");
      await RNFS.copyFile(sourcePath, destinationPath);

      console.log("Status downloaded:", destinationPath);

      return {
        success: true,
        savedPath: destinationPath,
      };
    } catch (error) {
      console.error("Error downloading status:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Download multiple status files (batch download)
   */
  static async downloadMultipleStatuses(
    statuses: StatusFile[]
  ): Promise<DownloadResult[]> {
    const results: DownloadResult[] = [];

    for (const status of statuses) {
      const result = await this.downloadStatus(status);
      results.push(result);
    }

    return results;
  }

  /**
   * Get all downloaded files
   */
  static async getDownloadedFiles(): Promise<StatusFile[]> {
    try {
      const exists = await RNFS.exists(this.DOWNLOAD_FOLDER);
      if (!exists) {
        return [];
      }

      const files = await RNFS.readDir(this.DOWNLOAD_FOLDER);
      const downloadedFiles: StatusFile[] = [];

      for (const file of files) {
        if (file.isDirectory()) continue;

        const extension = file.name.split(".").pop()?.toLowerCase();
        let type: "image" | "video" | null = null;

        if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension || "")) {
          type = "image";
        } else if (
          ["mp4", "mkv", "avi", "mov", "3gp"].includes(extension || "")
        ) {
          type = "video";
        }

        if (type) {
          downloadedFiles.push({
            id: file.path,
            uri: `file://${file.path}`,
            name: file.name,
            type,
            size: file.size,
            timestamp: file.mtime ? new Date(file.mtime).getTime() : Date.now(),
          });
        }
      }

      return downloadedFiles.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error("Error getting downloaded files:", error);
      return [];
    }
  }

  /**
   * Delete a downloaded file
   */
  static async deleteFile(filePath: string): Promise<boolean> {
    try {
      const path = filePath.replace("file://", "");
      await RNFS.unlink(path);
      console.log("File deleted:", path);
      return true;
    } catch (error) {
      console.error("Error deleting file:", error);
      return false;
    }
  }

  /**
   * Get download folder path
   */
  static getDownloadFolderPath(): string {
    return this.DOWNLOAD_FOLDER;
  }
}
