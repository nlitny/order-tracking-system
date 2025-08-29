import { useState, useCallback } from "react";
import { AttachedFile } from "@/types/order";

const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "video/mp4",
  "application/pdf",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_TOTAL_SIZE = 10 * 1024 * 1024; // 10MB total
const MAX_FILES = 10;

export const useFileUpload = () => {
  const [files, setFiles] = useState<AttachedFile[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const validateFiles = useCallback(
    (fileList: FileList): { validFiles: AttachedFile[]; errors: string[] } => {
      const validFiles: AttachedFile[] = [];
      const newErrors: string[] = [];

      // Check total number of files
      if (files.length + fileList.length > MAX_FILES) {
        newErrors.push(`حداکثر ${MAX_FILES} فایل مجاز است`);
        return { validFiles: [], errors: newErrors };
      }

      let totalSize = files.reduce((sum, file) => sum + file.size, 0);

      Array.from(fileList).forEach((file) => {
        // Check file type
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
          newErrors.push(`${file.name}: نوع فایل پشتیبانی نمی‌شود`);
          return;
        }

        // Check file size
        if (file.size > MAX_FILE_SIZE) {
          newErrors.push(`${file.name}: حجم فایل نباید بیش از 10MB باشد`);
          return;
        }

        // Check total size
        if (totalSize + file.size > MAX_TOTAL_SIZE) {
          newErrors.push(`مجموع حجم فایل‌ها نباید بیش از 10MB باشد`);
          return;
        }

        // Check for duplicates
        const isDuplicate = files.some(
          (existing) =>
            existing.name === file.name && existing.size === file.size
        );

        if (isDuplicate) {
          newErrors.push(`${file.name}: فایل تکراری است`);
          return;
        }

        totalSize += file.size;
        validFiles.push({
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          size: file.size,
          type: file.type,
          file,
        });
      });

      return { validFiles, errors: newErrors };
    },
    [files]
  );

  const addFiles = useCallback(
    (fileList: FileList) => {
      const { validFiles, errors } = validateFiles(fileList);

      if (errors.length > 0) {
        setErrors(errors);
      } else {
        setErrors([]);
      }

      if (validFiles.length > 0) {
        setFiles((prev) => [...prev, ...validFiles]);
      }
    },
    [validateFiles]
  );

  const removeFile = useCallback((fileId: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId));
    setErrors([]);
  }, []);

  const clearFiles = useCallback(() => {
    setFiles([]);
    setErrors([]);
  }, []);

  const getTotalSize = useCallback(() => {
    return files.reduce((sum, file) => sum + file.size, 0);
  }, [files]);

  return {
    files,
    errors,
    addFiles,
    removeFile,
    clearFiles,
    getTotalSize,
  };
};
