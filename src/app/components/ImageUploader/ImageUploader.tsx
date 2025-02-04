"use client";
import React, { ChangeEvent, DragEvent, useState } from "react";
import axios from "axios";
import {
    Box,
    Typography,
    Button,
    IconButton,
    Grid,
    Card,
    CardMedia,
    CircularProgress,
} from "@mui/material";
import { Upload, Computer } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";

type ImageData = {
    id: number | string;
    file?: File;
    url:string,
};

type ImageUploaderProps = {
    images: ImageData[];
    setImages: React.Dispatch<React.SetStateAction<ImageData[]>>;
};

const MAX_IMAGES = 10;

const ImageUploader: React.FC<ImageUploaderProps> = ({ images, setImages }) => {
    const [uploading, setUploading] = useState(false);

    const handleFileUpload = (event: ChangeEvent<HTMLInputElement>): void => {
        if (event.target.files) {
            const files = Array.from(event.target.files).slice(0, MAX_IMAGES - images.length);
            const newImages:ImageData[] = files.map((file) => ({
                id: Math.random(),
                file,
                url:URL.createObjectURL(file)
            }));
            console.log('newImages:',newImages);
            setImages((prevImages) => [...prevImages, ...newImages]);
        }
    };

    const handleDragOver = (event: DragEvent<HTMLDivElement>): void => {
        event.preventDefault();
        event.stopPropagation();
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>): void => {
        event.preventDefault();
        event.stopPropagation();

        if (event.dataTransfer.files) {
            const files = Array.from(event.dataTransfer.files)
                .filter((file) => file.type.startsWith("image/"))
                .slice(0, MAX_IMAGES - images.length);
            const newImages = files.map((file) => ({
                id: Math.random(),
                file,
                url:URL.createObjectURL(file)  as string
            }));
            setImages((prevImages) => ([...prevImages, ...newImages]));
        }
    };
    const [deletingImages,setDeletingImages]=useState<any[] >([]);
    const handleDeleteImage =async  (id: string | number) => {
        const img=images.find((image) => image.id === id)
        console.log('img:',img);
        if(!img?.file && img){
            setDeletingImages(prevState =>([...prevState,img.id]) )
                await axios.delete(`/api/deleteImage/${img?.id}`)
            setDeletingImages(prevState =>prevState.filter(imageId=>imageId!==img.id) )

        }
                setImages((prevImages) => prevImages.filter((image) => image.id !== id));
    };
    const handleUpload = async () => {
        if (images.length === 0) return;

        setUploading(true);
        const formData = new FormData();

        const uploadedFiles=images.filter(img=>img.file)
        uploadedFiles.forEach((image) => formData.append("images", image.file as File));
        const filesIds=uploadedFiles.map(el=>el.id);
        try {
            const response = await axios.post<any>("/api/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (response.status === 200) {
                const uploadedUrls = response.data.images;
                console.log('uploadedUrls:',uploadedUrls);
                setImages(prevState =>[...prevState
                    .filter(img=>!filesIds.includes(img.id)),...uploadedUrls])
            }
        } catch (error) {
            console.error("Upload failed:", error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                    border: "2px solid",
                    borderColor: "primary.main",
                    borderRadius: "8px",
                    p: 4,
                    textAlign: "center",
                    cursor: images.length < MAX_IMAGES ? "pointer" : "not-allowed",
                    opacity: images.length < MAX_IMAGES ? 1 : 0.5,
                }}
                onClick={() => images.length < MAX_IMAGES && document.getElementById("file-input")?.click()}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <Upload fontSize="large" color="action" />
                <Typography variant="body1">Upload at least {MAX_IMAGES - images.length} photo(s)</Typography>
                <Typography variant="body2" color="gray">
                    Support JPEG, PNG, TIFF, GIF, WebP, BMP
                </Typography>
                <Button
                    variant="outlined"
                    sx={{ color: "black", borderColor: "black" }}
                    endIcon={<Computer />}
                    disabled={images.length >= MAX_IMAGES}
                >
                    Upload from this computer
                </Button>
                <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={handleFileUpload}
                    disabled={images.length >= MAX_IMAGES}
                />
            </Box>

            {images.length > 0 && (
                <Grid container spacing={2} sx={{ mt: 4 }}>
                    {images.map((image) => (
                        <Grid item xs={12} sm={6} md={4} key={image.id}>
                            <Card sx={{ position: "relative" }}>
                                <IconButton
                                    color="error"
                                    onClick={() => handleDeleteImage(image.id)}
                                    sx={{
                                        position: "absolute",
                                        top: 8,
                                        right: 8,
                                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                                    }}
                                    disabled={deletingImages.includes(image.id) || (image.file && uploading)  }
                                >
                                    {deletingImages.includes(image.id) ? (
                                        <CircularProgress size={24} color="primary" />
                                    ) : (
                                        <DeleteIcon />
                                    )}
                                </IconButton>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={image.url}
                                    alt="Uploaded Image"
                                    sx={{
                                        objectFit: "contain",
                                        backgroundColor: "#f0f0f0",
                                    }}
                                />
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
            {images.filter(img=>img.file).length > 0 && (
                <Button
                    variant="contained"
                    sx={{ mt: 3 }}
                    onClick={handleUpload}
                    disabled={uploading}
                >
                    {uploading ? <CircularProgress size={24} /> : "Upload Images"}
                </Button>
            )}
        </Box>
    );
};

export default ImageUploader;
