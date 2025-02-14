"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Container, TextField, Button, Typography, Alert, AlertColor } from "@mui/material";
import { createClient } from "@/utils/supabase/client";

export default function ResetPassword() {
    const searchParams = useSearchParams();
    const [token, setToken] = useState<string | null>(null);
    const supabase = createClient();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState<{ type: string; text: string }>({ type: "", text: "" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Delay accessing searchParams to avoid Next.js Suspense error
        setToken(searchParams.get("token"));
    }, [searchParams]);

    useEffect(() => {
        if (token === null) {
            setMessage({ type: "error", text: "Invalid or missing token" });
        }
    }, [token]);

    const handleResetPassword = async () => {
        if (password !== confirmPassword) {
            setMessage({ type: "error", text: "Passwords do not match" });
            return;
        }

        setLoading(true);
        setMessage({ type: "", text: "" });

        try {
            const { error } = await supabase.auth.updateUser({
                password,
            });

            if (error) throw error;

            setMessage({ type: "success", text: "Password successfully updated!" });
        } catch (err: any) {
            setMessage({ type: "error", text: err.message || "Error updating password" });
        }

        setLoading(false);
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Typography variant="h4" gutterBottom>
                Reset Password
            </Typography>
            <Typography variant="body1" gutterBottom>
                Enter a new password for your account.
            </Typography>

            {message.text && <Alert severity={message.type as AlertColor}>{message.text}</Alert>}

            <TextField
                fullWidth
                type="password"
                label="New Password"
                variant="outlined"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
                fullWidth
                type="password"
                label="Confirm Password"
                variant="outlined"
                margin="normal"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleResetPassword}
                disabled={loading || token === null}
                sx={{ mt: 2 }}
            >
                {loading ? "Updating..." : "Save New Password"}
            </Button>
        </Container>
    );
}
