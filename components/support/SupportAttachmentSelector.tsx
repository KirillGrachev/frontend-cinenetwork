import React, { useRef, useState } from 'react';
import type { UseFormRegister } from 'react-hook-form';
import { AttachmentType } from '../../types';
import { useLocale } from '../../context/LocaleContext';
import type { SupportFormValues } from '../../utils/validationSchemas';
import Button from '../ui/Button';

interface SupportAttachmentSelectorProps {
    attachmentType: AttachmentType;
    isDragOver: boolean;
    onTypeChange: (type: AttachmentType) => void;
    onSetDrag: (state: boolean) => void;
    register: UseFormRegister<SupportFormValues>;
    error?: string;
    selectedFiles: File[];
    onFilesChange: (files: File[]) => void;
}

const SupportAttachmentSelector: React.FC<SupportAttachmentSelectorProps> = ({
    attachmentType,
    isDragOver,
    onTypeChange,
    onSetDrag,
    register,
    error,
    selectedFiles,
    onFilesChange,
}) => {
    const { t } = useLocale();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fileError, setFileError] = useState<string | null>(null);

    const inputStyle = `bg-item-primary border ${error ? 'border-red-500/50' : 'border-border-light'} rounded-xl px-4 py-3 h-14 text-base text-white placeholder-gray-500 outline-none focus:outline-none transition-colors w-full`;

    const cycleType = (e: React.MouseEvent) => {
        e.preventDefault();
        onTypeChange(
            attachmentType === AttachmentType.File ? AttachmentType.Link : AttachmentType.File,
        );
    };

    const handleFilesAdded = (files: FileList | File[]) => {
        setFileError(null);
        const MAX_SIZE = 10 * 1024 * 1024; // 10MB
        const newValidFiles: File[] = [];
        const newErrors: string[] = [];

        Array.from(files).forEach((file) => {
            if (file.size > MAX_SIZE) {
                newErrors.push(`Файл "${file.name}" превышает 10 MB`);
            } else {
                newValidFiles.push(file);
            }
        });

        if (newErrors.length > 0) {
            setFileError(newErrors.join(', '));
        }

        if (newValidFiles.length > 0) {
            onFilesChange([...selectedFiles, ...newValidFiles]);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFilesAdded(e.target.files);
            e.target.value = '';
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        onSetDrag(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFilesAdded(e.dataTransfer.files);
        }
    };

    const removeFile = (indexToRemove: number) => {
        onFilesChange(selectedFiles.filter((_, index) => index !== indexToRemove));
        setFileError(null);
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const getFileIcon = (file: File) => {
        if (file.type.startsWith('image/')) return 'fa-regular fa-file-image';
        if (file.type.startsWith('video/')) return 'fa-regular fa-file-video';
        if (file.type.includes('pdf')) return 'fa-regular fa-file-pdf';
        if (file.type.includes('zip') || file.type.includes('rar'))
            return 'fa-regular fa-file-zipper';
        return 'fa-regular fa-file-lines';
    };

    return (
        <div>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                multiple
                accept="image/*,video/*,application/pdf,.doc,.docx,.zip,.rar,.txt"
                className="hidden"
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <label className="block text-base font-medium text-gray-300">
                    {t('support.attachFiles')}
                </label>

                <div className="z-30">
                    <Button
                        type="button"
                        variant="black"
                        size="md"
                        onClick={cycleType}
                        className="font-medium min-w-[220px] group transition-all !px-4 h-12"
                    >
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-3">
                                <i
                                    className={`${attachmentType === AttachmentType.File ? 'fa-regular fa-file' : 'fa-solid fa-link'} text-gray-400 group-hover:text-black transition-colors`}
                                ></i>
                                <span>
                                    {attachmentType === AttachmentType.File
                                        ? t('support.files')
                                        : t('support.videoLink')}
                                </span>
                            </div>
                            <div className="bg-white/10 rounded-full w-6 h-6 flex items-center justify-center ml-3 group-hover:bg-black/10 transition-colors">
                                <i className="fa-solid fa-rotate text-[10px] text-gray-400 group-hover:text-black transition-colors"></i>
                            </div>
                        </div>
                    </Button>
                </div>
            </div>

            {/* Content Transition Container */}
            <div className="relative flex flex-col justify-center overflow-hidden transition-all duration-300">
                {attachmentType === AttachmentType.File ? (
                    <div key="file-dropzone" className="w-full space-y-3 animate-fade-in">
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className={`border border-dashed rounded-2xl h-28 flex flex-col items-center justify-center gap-2 transition-all duration-300 cursor-pointer group ${
                                isDragOver
                                    ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.15)] scale-[1.01]'
                                    : 'border-border-medium bg-item-primary hover:bg-panel-secondary hover:border-border-focus'
                            }`}
                            onDragOver={(e) => {
                                e.preventDefault();
                                onSetDrag(true);
                            }}
                            onDragLeave={() => onSetDrag(false)}
                            onDrop={handleDrop}
                        >
                            <i
                                className={`fa-solid fa-cloud-arrow-up text-xl text-gray-400 group-hover:text-gray-200 transition-colors ${isDragOver ? 'animate-bounce' : ''}`}
                            />
                            <div className="text-center">
                                <p className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                                    {t('support.dropFiles')}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {t('support.fileSizeLimit')}
                                </p>
                            </div>
                        </div>

                        {fileError && (
                            <p className="text-xs text-red-400 font-medium animate-fade-in ml-1">
                                {fileError}
                            </p>
                        )}

                        {selectedFiles.length > 0 && (
                            <div className="space-y-2 pt-1">
                                {selectedFiles.map((file, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between bg-item-primary border border-border-medium rounded-xl px-4 h-14 text-base text-gray-300"
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden mr-3">
                                            <i
                                                className={`${getFileIcon(file)} text-blue-400 text-lg flex-shrink-0`}
                                            ></i>
                                            <span className="truncate font-medium text-white">
                                                {file.name}
                                            </span>
                                            <span className="text-xs text-gray-500 flex-shrink-0">
                                                ({formatFileSize(file.size)})
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeFile(idx)}
                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0 ml-2"
                                            title="Удалить файл"
                                        >
                                            <i className="fa-solid fa-xmark text-sm"></i>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div
                        key="link-input"
                        className="w-full flex flex-col justify-center py-1 relative animate-fade-in"
                    >
                        <input
                            {...register('link')}
                            type="text"
                            placeholder={t('support.linkPlaceholder')}
                            className={inputStyle}
                            autoComplete="off"
                            maxLength={500}
                        />
                        {error && (
                            <p className="text-xs text-red-400 font-medium animate-fade-in mt-1.5 ml-1">
                                {error}
                            </p>
                        )}
                        <div className="flex items-center gap-2 mt-2.5 text-xs text-gray-500 font-medium ml-1">
                            <i className="fa-regular fa-circle-question text-gray-400"></i>
                            <span>
                                Мы поддерживаем YouTube, Vimeo и другие популярные видеохостинги
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SupportAttachmentSelector;
