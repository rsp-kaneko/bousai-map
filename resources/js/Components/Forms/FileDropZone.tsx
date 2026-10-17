import React, { FC, useRef, useState, DragEvent, ChangeEvent } from 'react';
import {
    Box,
    Button,
    Typography,
    Stack,
    IconButton,
    Alert,
    Paper
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloseIcon from '@mui/icons-material/Close';
import usePrefecture from '@/Hooks/usePrefecture';
import useCoastLine from '@/Hooks/useCoastLine';
import usePointLayer from '@/Hooks/usePointLayer';

type Props = {
    dataType: string;
    title: string;
    description?: string;
    accept?: string;
};

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const FileDropZone: FC<Props> = ({
    dataType,
    title,
    description = 'GeoJSON (.geojson, .json) ファイルをドラッグ＆ドロップするか、クリックして選択してください',
    accept = '.geojson,.json,application/geo+json,application/json'
}) => {
    const {storePrefecturePolygons} = usePrefecture()
    const {storeCoastLines} = useCoastLine()
    const {storePoints} = usePointLayer()
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateAndSetFile = (file?: File) => {
        if (!file) return;

        setErrorMessage(null);

        const fileName = file.name.toLowerCase();
        const isValidGeoJson = fileName.endsWith('.geojson') || fileName.endsWith('.json');

        if (!isValidGeoJson) {
            setErrorMessage('GeoJSON形式 (.geojson または .json) のファイルを選択してください。');
            setSelectedFile(null);
            return;
        }

        setSelectedFile(file);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            validateAndSetFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            validateAndSetFile(e.target.files[0]);
        }
    };

    const handleClearFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedFile(null);
        setErrorMessage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleZoneClick = () => {
        fileInputRef.current?.click();
    };

    // geojson データアップロード
    const handleUploadClick = () => {
        if (!selectedFile) return;
        switch(dataType) {
            case 'prefecture':
                storePrefecturePolygons(selectedFile)
                break
            case 'coastLines':
                storeCoastLines(selectedFile)
                break
            case 'point':
                storePoints(selectedFile)
                break
            default:
                return
        }
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold', mb: 1 }}>
                {title}
            </Typography>

            {description && (
                <Typography variant="body2" sx={{ color: '#aaa', mb: 2 }}>
                    {description}
                </Typography>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
            />

            <Box
                onClick={handleZoneClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                sx={{
                    border: '2px dashed',
                    borderColor: isDragging ? '#4fc3f7' : selectedFile ? '#66bb6a' : '#555',
                    borderRadius: 2,
                    p: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: isDragging
                        ? 'rgba(79, 195, 247, 0.08)'
                        : selectedFile
                        ? 'rgba(102, 187, 106, 0.05)'
                        : 'rgba(255, 255, 255, 0.02)',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        borderColor: '#4fc3f7',
                        backgroundColor: 'rgba(79, 195, 247, 0.05)',
                    }
                }}
            >
                {!selectedFile ? (
                    <Stack spacing={1.5} sx={{ alignItems: 'center', justifyContent: 'center' }}>
                        <CloudUploadIcon
                            sx={{
                                fontSize: 48,
                                color: isDragging ? '#4fc3f7' : '#888',
                                transition: 'color 0.2s ease, transform 0.2s ease',
                                transform: isDragging ? 'scale(1.1)' : 'scale(1)'
                            }}
                        />
                        <Typography variant="body1" sx={{ color: '#eee', fontWeight: 500 }}>
                            ファイルをここにドラッグ＆ドロップ
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#888' }}>
                            またはクリックしてファイルを参照（.geojson, .json）
                        </Typography>
                    </Stack>
                ) : (
                    <Stack spacing={2} sx={{ alignItems: 'center' }}>
                        <Paper
                            elevation={0}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                backgroundColor: '#1e1e1e',
                                px: 2,
                                py: 1.2,
                                borderRadius: 1.5,
                                border: '1px solid #444',
                                maxWidth: '100%'
                            }}
                        >
                            <InsertDriveFileIcon sx={{ color: '#4fc3f7', fontSize: 28 }} />
                            <Box sx={{ textAlign: 'left', overflow: 'hidden' }}>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: '#fff',
                                        fontWeight: 'medium',
                                        textOverflow: 'ellipsis',
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap',
                                        maxWidth: 320
                                    }}
                                >
                                    {selectedFile.name}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#888' }}>
                                    {formatFileSize(selectedFile.size)}
                                </Typography>
                            </Box>
                            <IconButton
                                size="small"
                                onClick={handleClearFile}
                                sx={{ color: '#aaa', '&:hover': { color: '#f44336' }, ml: 1 }}
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Paper>
                        <Typography variant="caption" sx={{ color: '#aaa' }}>
                            別のファイルに変更するには、再度ドラッグ＆ドロップまたはクリックしてください
                        </Typography>
                    </Stack>
                )}
            </Box>

            {errorMessage && (
                <Alert severity="error" sx={{ mt: 2, backgroundColor: '#3b1818', color: '#ff8a80' }}>
                    {errorMessage}
                </Alert>
            )}

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    variant="contained"
                    disabled={!selectedFile}
                    onClick={handleUploadClick}
                    sx={{
                        backgroundColor: '#1976d2',
                        fontWeight: 'bold',
                        px: 3,
                        py: 1,
                        '&:hover': {
                            backgroundColor: '#1565c0'
                        },
                        '&.Mui-disabled': {
                            backgroundColor: '#3a3a3a',
                            color: '#777'
                        }
                    }}
                >
                    アップロード
                </Button>
            </Box>
        </Box>
    );
};

export default FileDropZone;
