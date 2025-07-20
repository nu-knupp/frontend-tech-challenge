import { cookies } from 'next/headers';
import LayoutContainer from '@/components/layout/Layout';
import FinancialSummary from '@/components/home/FinancialSummary';
import { Transaction } from '@/types/Transaction';
import { Box, Button, Card, Typography } from '@mui/material';
import { Key, Receipt, Savings } from '@mui/icons-material';
import Image from 'next/image';
import Link from 'next/link';

async function getTransactions(session: string | undefined): Promise<Transaction[]> {
  if (!session) return [];

  const res = await fetch('http://localhost:3000/api/transactions', {
    headers: {
      Cookie: `session=${session}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    console.error('Erro ao buscar transações');
    return [];
  }

  return res.json();
}

export default async function Home() {
  const cookieStore = cookies();
  const session = (await cookieStore).get('session')?.value;

  const transactions = await getTransactions(session);

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
              <Typography
                variant='h5'
                sx={{
                  mb: 3,
                  color: 'primary.main',
                  textAlign: { xs: 'center', md: 'left' },
                }}
              >
                Seu dinheiro. Sua maneira. Seu controle financeiro simplificado.
              </Typography>
              <Typography
                variant='body1'
                sx={{
                  mb: 4,
                  textAlign: { xs: 'center', md: 'left' },
                }}
              >
                Gerencie suas transações financeiras de forma rápida e intuitiva.
                Sem complicações, sem taxas escondidas. Apenas simplicidade bancária.
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
                  maxWidth: { xs: '100%', sm: '480px', md: '480px' },
                }}
              >
                <Image
                  src='/bank-illustration.png'
                  alt='Banco'
                  fill
                  sizes='(max-width: 600px) 100vw, 480px'
                  style={{ objectFit: 'contain' }}
                  priority
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
