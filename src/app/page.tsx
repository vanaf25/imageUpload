"use client";
import { Container, Grid, Typography, Box} from '@mui/material';
import { useState } from 'react';
import ImageUploader from '@/app/components/ImageUploader/ImageUploader';
import Image from 'next/image';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import photoRequirement from '@/images/photoRequirement.jpg';

type ImageData = {
    id: string;
    file: File;
};

const UploadPhotos = () => {
    const [images, setImages] = useState<ImageData[]>([]);



    return (
        <Container maxWidth="lg" sx={{ margin: "0 auto", padding: "0 10px",mt:2 }}>
            <Grid container spacing={4} sx={{ mb: 2 }}>
                {/* First Block */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h3" gutterBottom>
                        Upload your best photos
                    </Typography>
                    <Typography variant="body1" color="gray" gutterBottom>
                        Important: your headshots depend completely on the photos you upload.
                    </Typography>
                    <Typography variant="body1" color="black" gutterBottom>
                        Upload at least 2 upper body shots and 8 close-up photos of your face.
                    </Typography>
                    <ImageUploader images={images} setImages={setImages} />
                </Grid>

                {/* Second Block */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h4" gutterBottom>
                        Photo requirements
                    </Typography>

                    {["Proper Lighting", "Clear Background", "High Resolution"].map((title, index) => (
                        <Box key={index} sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <CheckCircleIcon color="primary" />
                                <Typography variant="h6">{title}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                {[...Array(3)].map((_, i) => (
                                    <Box key={i} sx={{ position: 'relative', width: 100, height: 100 }}>
                                        <Image src={photoRequirement} alt="Photo requirement" width={100} height={100} style={{ borderRadius: 8 }} />
                                        <CheckCircleIcon sx={{ position: 'absolute', top: 4, right: 4, color: 'green' }} />
                                    </Box>
                                ))}
                                <Box sx={{ position: 'relative', width: 100, height: 100 }}>
                                    <Image src={photoRequirement} alt="Photo requirement" width={100} height={100} style={{ borderRadius: 8 }} />
                                    <CancelIcon sx={{ position: 'absolute', top: 4, right: 4, color: 'red' }} />
                                </Box>
                            </Box>
                        </Box>
                    ))}
                </Grid>
            </Grid>

        </Container>
    );
};

export default UploadPhotos;
