"use client";

import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { AccountBalance } from "@mui/icons-material";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const router = useRouter();

    useEffect(() => {
        if (document.cookie.includes("session=")) {
            router.replace("/home");
        }
    }, [router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try {
            await api.post("/login", { email, password });
            router.push("/");
        } catch (err) {
            setMessage("Email ou senha inválidos.");
        }
        setLoading(false);
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            width: '100%',
            bgcolor: 'background.default',
            position: 'relative',
        }}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    alignItems: "center",
                    maxWidth: "700px",
                    width: "90%",
                    margin: "0 auto",
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 0,
                }}>
                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        alignItems: "center",
                        gap: { xs: 8, md: 58 },
                    }}>
                    <Box sx={{ flex: 1, maxWidth: 320, ml: { md: -10 }, alignItems: 'flex-start', display: 'flex', mt: { md: 15 } }}>
                        <Box sx={{ width: '100%' }}>
                            <Typography variant="h3" sx={{ mb: 2, fontWeight: "bold", color: "primary.main", textAlign: { xs: "center", md: "left" }, mt: { xs: 3, md: 0 }, display: { xs: 'block', md: 'none' } }}>
                                Banco Simples
                            </Typography>
                            <Typography variant="h5" sx={{ mb: 3, color: "primary.main", textAlign: { xs: "center", md: "left" }, maxWidth: { xs: '100%', md: 320 }, width: { md: 180 }, whiteSpace: 'normal' }}>
                                Seu dinheiro. Sua maneira. Seu controle financeiro simplificado.
                            </Typography>
                            {/* Card principal no mobile */}
                            <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                <Box sx={{ maxWidth: 400, width: '100%', p: 2, boxShadow: 3, borderRadius: 3, bgcolor: 'background.paper', display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 1 }}>
                                    <AccountBalance sx={{ fontSize: 64, color: 'primary.main', display: { xs: 'none', md: 'block' } }} />
                                    <Typography variant="h5" mt={1} mb={2} color="primary" sx={{ display: { xs: 'none', md: 'block' } }}>
                                        Banco Simples
                                    </Typography>
                                    <Typography variant="h4" mb={1} align="center">Login</Typography>
                                    <form onSubmit={handleLogin} style={{ width: '100%' }}>
                                        <TextField
                                            label="Email"
                                            type="email"
                                            fullWidth
                                            margin="dense"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            required
                                            sx={{ mb: 1 }}
                                        />
                                        <TextField
                                            label="Senha"
                                            type="password"
                                            fullWidth
                                            margin="dense"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            required
                                            sx={{ mb: 1 }}
                                        />
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            fullWidth
                                            disabled={loading}
                                            sx={theme => ({
                                                borderRadius: 3,
                                                bgcolor: theme.palette.primary.main,
                                                color: theme.palette.primary.contrastText,
                                                fontWeight: 'bold',
                                                py: 1.5,
                                                boxShadow: 2,
                                                textTransform: 'none',
                                                fontSize: 18,
                                                '&:hover': {
                                                    bgcolor: theme.palette.primary.dark,
                                                },
                                            })}
                                        >
                                            {loading ? "Entrando..." : "Entrar"}
                                        </Button>
                                        {message && <Typography mt={1} align="center">{message}</Typography>}
                                        <Box sx={{ mt: 1, textAlign: 'center' }}>
                                            <Typography variant="body2">
                                                Não tem conta? <Link href="/register">Cadastre-se</Link>
                                            </Typography>
                                        </Box>
                                    </form>
                                </Box>
                            </Box>
                            <Typography variant="body1" sx={{ mb: 3, textAlign: { xs: "center", md: "left" }, mt: { xs: 4, md: 0 } }}>
                                Gerencie suas transações financeiras de forma rápida e intuitiva.
                                Sem complicações, sem taxas escondidas. Apenas simplicidade bancária.
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ flex: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end', width: '100%', maxWidth: 600, mr: { md: -32 } }}>
                        <Box
                            sx={{
                                position: "relative",
                                width: 480,
                                height: 480,
                                flexShrink: 0,
                                maxWidth: 480
                            }}>
                            <Image
                                src="/bank-illustration.png"
                                alt="Banco"
                                fill
                                sizes="480px"
                                style={{ objectFit: "contain" }}
                                priority
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>
            {/* Card principal desktop */}
            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', alignItems: 'flex-start', zIndex: 1, mt: { md: 10 } }}>
                <Box sx={{ maxWidth: 400, width: '100%', p: 4, boxShadow: 3, borderRadius: 3, bgcolor: 'background.paper', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <AccountBalance sx={{ fontSize: 64, color: 'primary.main' }} />
                    <Typography variant="h5" mt={1} mb={2} color="primary">Banco Simples</Typography>
                    <Typography variant="h4" mb={2} align="center">Login</Typography>
                    <form onSubmit={handleLogin} style={{ width: '100%' }}>
                        <TextField
                            label="Email"
                            type="email"
                            fullWidth
                            margin="normal"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                        <TextField
                            label="Senha"
                            type="password"
                            fullWidth
                            margin="normal"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={loading}
                            sx={theme => ({
                                borderRadius: 3,
                                bgcolor: theme.palette.primary.main,
                                color: theme.palette.primary.contrastText,
                                fontWeight: 'bold',
                                py: 1.5,
                                boxShadow: 2,
                                textTransform: 'none',
                                fontSize: 18,
                                '&:hover': {
                                    bgcolor: theme.palette.primary.dark,
                                },
                            })}
                        >
                            {loading ? "Entrando..." : "Entrar"}
                        </Button>
                        {message && <Typography mt={2} align="center">{message}</Typography>}
                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Typography variant="body2">
                                Não tem conta? <Link href="/register">Cadastre-se</Link>
                            </Typography>
                        </Box>
                    </form>
                </Box>
            </Box>
        </Box>
    );
}
