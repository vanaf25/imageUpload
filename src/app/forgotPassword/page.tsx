"use client";

import { useState } from "react";
import { TextField, Button, Container, Typography, Alert } from "@mui/material";
import axios from "axios";
import {createClient} from "@/utils/supabase/client";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState({ type: "", text: "" });
    const [loading, setLoading] = useState(false);
    const supabase=createClient();
    const handleForgotPassword = async () => {
        setLoading(true);
        setMessage({ type: "", text: "" });

        try {
            const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/resetPassword`, // Update this route as needed
            });

            if (error) throw error;

            setMessage({ type: "success", text: "Password reset email sent!" });
        } catch (err:any) {
            setMessage({ type: "error", text: err.message || "Something went wrong!" });
        }

        setLoading(false);
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Typography variant="h4" gutterBottom>
                Forgot Password
            </Typography>
            <Typography variant="body1" gutterBottom>
                Enter your email and we'll send you a link to reset your password.
            </Typography>

            {message.text && <Alert severity={"info"}>{message.text}</Alert>}

            <TextField
                fullWidth
                label="Email"
                variant="outlined"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleForgotPassword}
                disabled={loading}
                sx={{ mt: 2 }}
            >
                {loading ? "Sending..." : "Send Reset Link"}
            </Button>
        </Container>
    );
}
