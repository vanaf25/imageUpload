"use client";
import React, { useState, FormEvent } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import {createClient} from "@/utils/supabase/client";

interface LoginFormState {
    email: string;
    password: string;
}

const Page: React.FC = () => {
    const [formState, setFormState] = useState<LoginFormState>({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const router = useRouter();
    const supabase=createClient();
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
            // Redirect to the home page after successful login
            router.push('/');  // This will redirect to the home page
        } catch (err: any) {
            setError(err.message || 'An error occurred during login.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
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
            </Box>
        </Container>
    );
};

export default Page;
