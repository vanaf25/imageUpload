"use client";
import React, { ChangeEvent, DragEvent } from "react";
import {
    Box,
    Typography,
    Button,
    IconButton,
    Grid,
    Card,
    CardMedia,
} from "@mui/material";
import { Upload, Computer } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";

type ImageData = {
    id: string;
    file: File;
};

type ImageUploaderProps = {
    images: ImageData[];
    setImages: React.Dispatch<React.SetStateAction<ImageData[]>>;
};

const MAX_IMAGES = 10;

const ImageUploader: React.FC<ImageUploaderProps> = ({ images, setImages }) => {
    const handleFileUpload = (event: ChangeEvent<HTMLInputElement>): void => {
        if (event.target.files) {
            const files = Array.from(event.target.files).slice(0, MAX_IMAGES - images.length);
            const newImages = files.map((file) => ({
                id: URL.createObjectURL(file),
                file,
            }));
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
                id: URL.createObjectURL(file),
                file,
            }));
            setImages((prevImages) => [...prevImages, ...newImages]);
        }
    };
    const handleDeleteImage = (id: string): void => {
        setImages((prevImages) => prevImages.filter((image) => image.id !== id));
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
                <Typography variant="body2" color="gray">Support JPEG
                    PNG
                    TIFF
                    GIF
                    WebP
                    BMP</Typography>
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
                                >
                                    <DeleteIcon />
                                </IconButton>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={image.id}
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
        </Box>
    );
};

export default ImageUploader;
