"use client";
import React, { useState, FormEvent } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import {createClient} from "@/utils/supabase/client";

const Page: React.FC = () => {
    const [formState, setFormState] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const supabase=createClient()
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (formState.password !== formState.confirmPassword) {
            console.log("Passwords do not match");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            // Register user via Supabase client
            const { data, error } = await supabase.auth.signUp({
                email: formState.email,
                password: formState.password,
            });

            if (error) {
                throw error;
            }

            console.log("User registered:", data.user);
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'An error occurred during registration.');
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
        <Container maxWidth="xs" sx={{ mt: 2 }}>
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
                    Register
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
                    <TextField
                        label="Confirm Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={formState.confirmPassword}
                        onChange={handleChange}
                        name="confirmPassword"
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
                        {loading ? 'Registering...' : 'Register'}
                    </Button>
                    {error && <Typography color="error" mt={2}>{error}</Typography>}
                    {success && <Typography color="success" mt={2}>Registration successful!</Typography>}
                </form>
            </Box>
        </Container>
    );
};

export default Page;
