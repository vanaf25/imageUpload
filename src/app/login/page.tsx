"use client";

import React, { useState, FormEvent } from 'react';
import { TextField, Button, Container, Typography, Box, Link } from '@mui/material';
import { useRouter } from 'next/navigation';
import { createClient } from "@/utils/supabase/client";
import NextLink from 'next/link';

const Page: React.FC = () => {
    const [formState, setFormState] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const router = useRouter();
    const supabase = createClient();

    // Handle email & password login
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: formState.email,
                password: formState.password
            });

            if (error) {
                throw error;
            }

            console.log("User logged in:", data.user);
            setSuccess(true);
            router.push('/');
        } catch (err: any) {
            setError(err.message || 'An error occurred during login.');
        } finally {
            setLoading(false);
        }
    };

    // Handle form input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Handle Google Sign-In
    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
            });

            if (error) {
                throw error;
            }

            console.log("User logged in with Google:", data);
            setSuccess(true);
            router.push('/');
        } catch (err: any) {
            setError(err.message || 'An error occurred during Google login.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 4 }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: 3,
                    boxShadow: 3,
                    borderRadius: 2,
                }}
            >
                <Typography variant="h5" gutterBottom>
                    Login
                </Typography>

                {/* Google Sign-In Button */}
                <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    sx={{ marginTop: 2 }}
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                >
                    {loading ? 'Signing in with Google...' : 'Sign in with Google'}
                </Button>

                {/* Or use email/password login */}
                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <TextField
                        label="Email"
                        type="email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={formState.email}
                        onChange={handleChange}
                        name="email"
                        required
                    />
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={formState.password}
                        onChange={handleChange}
                        name="password"
                        required
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        color="primary"
                        sx={{ marginTop: 2 }}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </Button>

                    {error && <Typography color="error" mt={2}>{error}</Typography>}
                    {success && <Typography color="success" mt={2}>Login successful!</Typography>}
                </form>
                <Typography mt={2}>
                    Don't have an account?{' '}
                    <Link component={NextLink} href="/register" color="primary" underline="hover">
                        Register here
                    </Link>
                </Typography>
            </Box>
        </Container>
    );
};

export default Page;
