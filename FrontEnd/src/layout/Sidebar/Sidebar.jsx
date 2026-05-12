import { Box, Chip, Drawer, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DatabaseIcon from '@mui/icons-material/StorageRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import { BrowserView, MobileView } from 'react-device-detect';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Stack } from '@mui/system';
import MenuList from './MenuList/MenuList';
import { drawerWidth } from '../../store/constants';

const Sidebar = ({ drawerOpen, drawerToggle, window }) => {
    const theme = useTheme();
    const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));

    const brand = (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1, pt: 1, mb: 3 }}>
            <Box
                sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1,
                    display: 'grid',
                    placeItems: 'center',
                    background: '#2563EB',
                    color: '#EEF0FF',
                }}
            >
                <DatabaseIcon />
            </Box>
            <Box>
                <Typography sx={{ color: '#004AC6', fontWeight: 900, lineHeight: 1.1 }}>Oracle Library</Typography>
                <Typography sx={{ color: '#434655', fontSize: 12, fontWeight: 600 }}>Management System</Typography>
            </Box>
        </Box>
    );

    const footer = (
        <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid #C3C6D7' }}>
            <Stack direction="row" alignItems="center" spacing={1.2} sx={{ px: 1.5, py: 1.2 }}>
                <Box sx={{ width: 32, height: 32, borderRadius: '50%', display: 'grid', placeItems: 'center', background: '#E1E2ED', color: '#434655' }}>
                    <PersonRoundedIcon fontSize="small" />
                </Box>
                <Typography sx={{ fontWeight: 700, color: '#191B23' }}>Thủ thư 01</Typography>
            </Stack>
            <Chip
                icon={<LogoutRoundedIcon />}
                label="Đăng xuất"
                sx={{
                    justifyContent: 'flex-start',
                    width: '100%',
                    height: 44,
                    borderRadius: 2,
                    color: '#BA1A1A',
                    background: 'transparent',
                    fontWeight: 700,
                    '&:hover': { background: '#FFDAD6' },
                }}
            />
        </Box>
    );

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
            {brand}
            <BrowserView>
                <PerfectScrollbar component="div" style={{ flex: 1, minHeight: 0 }}>
                    <MenuList />
                </PerfectScrollbar>
            </BrowserView>
            <MobileView>
                <Box sx={{ flex: 1 }}>
                    <MenuList />
                </Box>
            </MobileView>
            {footer}
        </Box>
    );

    const container = window !== undefined ? () => window.document.body : undefined;

    return (
        <Box component="nav" sx={{ flexShrink: { md: 0 }, width: matchUpMd ? drawerWidth : 'auto' }} aria-label="Điều hướng thư viện">
            <Drawer
                container={container}
                variant={matchUpMd ? 'persistent' : 'temporary'}
                anchor="left"
                open={drawerOpen}
                onClose={drawerToggle}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        background: '#FAF8FF',
                        color: '#191B23',
                        borderRight: '1px solid #C3C6D7',
                        boxShadow: 'none',
                    },
                }}
                ModalProps={{ keepMounted: true }}
                color="inherit"
            >
                {drawer}
            </Drawer>
        </Box>
    );
};

export default Sidebar;
