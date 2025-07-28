"use client";

import React, { useEffect, useState } from 'react';
import LayoutContainer from '@/components/layout/Layout';
import FinancialSummary from '@/components/home/FinancialSummary';
import { Transaction } from '@/types/Transaction';
import { Box, Button, Card, Typography } from '@mui/material';
import { Key, Receipt, Savings } from '@mui/icons-material';
import Link from 'next/link';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';
// import { useRouter } from 'next/navigation';

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { isAuthenticated, isAuthLoading } = useAuth();

  useEffect(() => {
    if (isAuthLoading) return;
    if (!isAuthenticated) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    } else {
      async function fetchTransactions() {
        try {
          const res = await api.get('/transactions?page=1&limit=5&sort=desc');
          if (res.data && res.data.transactions) {
            setTransactions(res.data.transactions);
          } else if (Array.isArray(res.data)) {
            setTransactions(res.data);
          } else {
            setTransactions([]);
          }
        } catch (e) {
          setTransactions([]);
        }
      }
      fetchTransactions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isAuthLoading]);

  if (isAuthLoading) {
    return null;
  }
  if (!isAuthenticated) {
    return null;
  }

  return (
    <LayoutContainer>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          overflowY: 'auto',
          boxSizing: 'border-box',
          padding: { xs: 2 },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            alignItems: 'center',
            maxWidth: '1200px',
            width: '100%',
            margin: '0 auto',
          }}
        >
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                variant='h3'
                sx={{
                  mb: 2,
                  fontWeight: 'bold',
                  color: 'primary.main',
                  textAlign: { xs: 'center', md: 'left' },
                }}
              >
                Banco Simples
              </Typography>
              <Button
                variant='contained'
                component={Link}
                href='/transactions'
                size='large'
                sx={{
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  width: { xs: '100%', sm: 'auto' },
                  fontSize: 'large',
                  fontWeight: 'bold',
                  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                  mt: 2,
                }}
              >
                Iniciar Agora
              </Button>
            </Box>
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: { xs: '100%', sm: '480px', md: '480px' },
                  height: { xs: '280px', sm: '480px', md: '480px' },
                  flexShrink: 0,
                  maxWidth: { xs: "100%", sm: "400px" }
                }}>
                <img
                  src={
                    typeof window !== "undefined"
                      ? `${window.location.origin.includes("9000") ? "http://localhost:8080/bank-illustration.png" : "/bank-illustration.png"}`
                      : "/bank-illustration.png"
                  }
                  alt="Banco"
                  width={400}
                  height={400}
                  style={{ objectFit: "contain", width: "100%", maxWidth: "400px", height: "auto" }}
                />
              </Box>
            </Box>
          </Box>

          <Box sx={{ width: '100%', mb: 4 }}>
            <Typography
              variant='h4'
              sx={{
                mb: 4,
                textAlign: 'center',
                color: 'primary.main',
              }}
            >
              Nossos Serviços
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: '1fr 1fr',
                  md: '1fr 1fr 1fr',
                },
                gap: 4,
              }}
            >
              <Card
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <Box sx={{ mb: 2, width: '80px', height: '80px', position: 'relative' }}>
                  <Receipt sx={{ width: '100%', height: 'auto', color: 'primary.main' }} />
                </Box>
                <Typography variant='h6' sx={{ mb: 2 }}>
                  Controle de Transações
                </Typography>
                <Typography variant='body2'>
                  Adicione, edite e visualize todas as suas transações em um só lugar,
                  com histórico detalhado e categorização inteligente.
                </Typography>
              </Card>
              <Card
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <Box sx={{ mb: 2, width: '80px', height: '80px', position: 'relative' }}>
                  <Savings sx={{ width: '100%', height: 'auto', color: 'primary.main' }} />
                </Box>
                <Typography variant='h6' sx={{ mb: 2 }}>
                  Saldo em Tempo Real
                </Typography>
                <Typography variant='body2'>
                  Acompanhe seu saldo bancário atualizado automaticamente
                  a cada transação, proporcionando visibilidade completa.
                </Typography>
              </Card>
              <Card
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <Box sx={{ mb: 2, width: '80px', height: '80px', position: 'relative' }}>
                  <Key sx={{ width: '100%', height: 'auto', color: 'primary.main' }} />
                </Box>
                <Typography variant='h6' sx={{ mb: 2 }}>
                  Acesso Rápido
                </Typography>
                <Typography variant='body2'>
                  Interface intuitiva e responsiva que funciona em qualquer dispositivo,
                  permitindo acesso às suas finanças em qualquer lugar.
                </Typography>
              </Card>
            </Box>
          </Box>

          <Link
            href="/analytics"
            style={{ textDecoration: "none", color: "inherit", width: "100%" }}
          >
            <Box sx={{ width: '100%', mb: 8, cursor: 'pointer' }}>
              <FinancialSummary transactions={transactions} />
            </Box>
          </Link>

          <Box
            sx={{
              width: '100%',
              p: 4,
              borderRadius: 2,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              textAlign: 'center',
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            }}>
            <Typography variant='h4'>
              Comece a gerenciar suas finanças hoje
            </Typography>
            <Typography variant='body1' sx={{ mb: 3 }}>
              Experimente o Banco Simples e descubra uma nova forma de controlar seu dinheiro.
            </Typography>
            <Button
              variant='contained'
              component={Link}
              href='/transactions'
              size='large'
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1.5,
                bgcolor: 'background.paper',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.9)',
                },
                boxShadow: 3,
                fontWeight: 'bold',
                fontSize: 'large',
              }}
            >
              Acessar Transações
            </Button>
          </Box>
        </Box>
      </Box>
    </LayoutContainer>
  );
}
