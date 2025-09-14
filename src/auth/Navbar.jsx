"use client";
import React from 'react';
import Link from 'next/link';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

const pages = ['Home', 'Fitur', 'Review', 'Faq'];

export default function GlassNavbar() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const list = () => (
  <Box
    sx={{
      width: 280,
      height: '100vh',
      bgcolor: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRadius: '0 10px 10px 0',
      boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
      border: '1px solid rgba(255, 255, 255, 0.18)',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      p: 2,
    }}
    role="presentation"
    onClick={toggleDrawer(false)}
    onKeyDown={toggleDrawer(false)}
  >
    <Box mb={2} px={1}>
      <Typography
        variant="h5"
        fontWeight="bold"
        sx={{ 
          userSelect: 'none',
         }}
      >
        Malas Nulis
      </Typography>
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.3)', mt: 1 }} />
    </Box>

    <List>
      {pages.map((page) => (
        <ListItem key={page} disablePadding>
          <ListItemButton component={Link} href={`/#${page.toLowerCase()}`}>
            <ListItemText primary={page} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>

    <Box>
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.3)', mb: 2 }} />
      <Link href="/sign-in" passHref>
        <Button
          variant="outlined"
          fullWidth
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderColor: 'white',
            },
            borderRadius: '12px',
            fontWeight: 'bold',
          }}
        >
          Sign In
        </Button>
      </Link>
    </Box>
  </Box>
);


  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
        color: '#fff',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {/* Logo - Desktop */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#home"
            sx={{
              mr: 4,
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
              display: { xs: 'none', md: 'flex' },
            }}
          >
            Malas Nulis
          </Typography>

          {/* Mobile Menu Button */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, justifyContent: 'flex-start' }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-haspopup="true"
              onClick={toggleDrawer(true)}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  backgroundColor: 'transparent',
                  boxShadow: 'none',
                },
              }}
            >
              {list()}
            </Drawer>
          </Box>


          {/* Nav Links - Desktop */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            {pages.map((page) => (
              <Button
                component={Link}
                key={page}
                href={`/#${page.toLowerCase()}`}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>

          {/* Buttons - Desktop */}
          <Link href="/sign-in" passHref>
            <Button variant="outlined" color="inherit">
              Sign In
            </Button>
          </Link>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
