"use client";
import { Container, Grid, Typography, Box, CircularProgress, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import ImageUploader from '@/app/components/ImageUploader/ImageUploader';
import Image from 'next/image';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import photoRequirement from '@/images/photoRequirement.jpg';
import axios from 'axios';
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

type ImageData = {
    id: string | number;
    file?: File;
    url: string;
};

const UploadPhotos = () => {
    const [images, setImages] = useState<ImageData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isLogOut, setIsLogOut] = useState<boolean>(false);
    const supabase = createClient();
    const router = useRouter();
    useEffect(() => {
        const fetchImages = async () => {
            try {
                setLoading(true);
                const response = await axios.get<any>('/api/getImages');
                console.log("Received images: ", response.data);
                setImages(prevState => [...prevState, ...response.data?.images?.map((el: any) => ({ id: el.id, url: el.url }))]);
            } catch (error) {
                console.error("Error fetching images:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, []);
    const handleLogOut = async () => {
        try {
            setIsLogOut(true);
            await supabase.auth.signOut();
            router.push("/login");
        } catch (error: any) {
            console.error('Logout error:', error);
        } finally {
            setIsLogOut(false);
        }
    };
    return (
        <Container maxWidth="lg" sx={{ margin: "0 auto", padding: "0 10px", mt: 2 }}>
            <Button
                variant="contained"
                sx={{ mb: 1 }}
                color="error"
                onClick={handleLogOut}
                disabled={isLogOut}
            >
                {isLogOut ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Log Out"}
            </Button>

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

                    {/* Show Loader While Fetching */}
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <ImageUploader images={images} setImages={setImages} />
                    )}
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
