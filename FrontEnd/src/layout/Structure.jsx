import { AppBar, Box, CssBaseline, Toolbar, useMediaQuery } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import { useMenu } from '../contexts/MenuContextProvider.jsx';
import { actions } from '../contexts/actions.jsx';
import { drawerWidth } from '../store/constants';
import Sidebar from './Sidebar/Sidebar';

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    ...theme.typography.mainContent,
    marginTop: '64px',
    minHeight: 'calc(100vh - 64px)',
    background: '#FAF8FF',
    borderRadius: 0,
    transition: theme.transitions.create('margin', {
        easing: open ? theme.transitions.easing.easeOut : theme.transitions.easing.sharp,
        duration: open ? theme.transitions.duration.enteringScreen : theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.up('md')]: {
        marginLeft: open ? 0 : -(drawerWidth - 20),
        width: `calc(100% - ${drawerWidth}px)`,
        padding: '32px',
    },
    [theme.breakpoints.down('md')]: {
        marginLeft: '16px',
        width: 'calc(100% - 32px)',
        padding: '24px 16px',
    },
    [theme.breakpoints.down('sm')]: {
        marginLeft: 0,
        width: '100%',
        padding: '16px',
        marginRight: 0,
    },
}));

const Structure = () => {
    const theme = useTheme();
    const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
    const { menuOpened, dispatch } = useMenu();
    const handleLeftDrawerToggle = () => {
        dispatch({ type: actions.TOGGLE_SIDE_DRAWER, id: menuOpened });
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', background: '#FAF8FF' }}>
            <CssBaseline />
            <AppBar
                enableColorOnDark
                position="fixed"
                color="inherit"
                elevation={0}
                sx={{
                    bgcolor: '#FAF8FF',
                    borderBottom: '1px solid #C3C6D7',
                    ml: { md: menuOpened.opened ? `${drawerWidth}px` : '20px' },
                    width: { md: menuOpened.opened ? `calc(100% - ${drawerWidth}px)` : 'calc(100% - 20px)' },
                    transition: theme.transitions.create(['margin', 'width']),
                }}
            >
                <Toolbar sx={{ minHeight: '64px !important', px: 0 }} disableGutters>
                    <Header handleLeftDrawerToggle={handleLeftDrawerToggle} />
                </Toolbar>
            </AppBar>
            <Sidebar drawerOpen={!matchDownMd ? menuOpened.opened : !menuOpened.opened} drawerToggle={handleLeftDrawerToggle} />
            <Main theme={theme} open={menuOpened.opened}>
                <Outlet />
            </Main>
        </Box>
    );
};

export default Structure;
