import { Box, ButtonBase, Chip, Typography } from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import StorageRoundedIcon from '@mui/icons-material/StorageRounded';

const Header = ({ handleLeftDrawerToggle }) => (
    <>
        <Box sx={{ display: 'flex', alignItems: 'center', px: { xs: 1.5, md: 3 } }}>
            <ButtonBase
                onClick={handleLeftDrawerToggle}
                aria-label="Mở hoặc đóng menu điều hướng"
                sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    color: '#434655',
                    background: '#FAF8FF',
                    border: '1px solid #C3C6D7',
                    transition: '150ms ease',
                    '&:hover': { color: '#004AC6', background: '#EDEDF9' },
                }}
            >
                <MenuRoundedIcon />
            </ButtonBase>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 3 }, pr: { xs: 1.5, md: 4 } }}>
            <Chip
                icon={<StorageRoundedIcon />}
                label="Oracle Connected"
                sx={{
                    height: 36,
                    borderRadius: 2,
                    color: '#434655',
                    background: '#F3F3FE',
                    border: '1px solid #C3C6D7',
                    fontWeight: 700,
                }}
            />
            <ButtonBase
                aria-label="Thông báo"
                sx={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    color: '#434655',
                    '&:hover': { background: '#EDEDF9', color: '#004AC6' },
                }}
            >
                <NotificationsNoneRoundedIcon />
            </ButtonBase>
            <Typography sx={{ color: '#191B23', fontWeight: 700, display: { xs: 'none', md: 'block' } }}>
                Thủ thư 01
            </Typography>
        </Box>
    </>
);

export default Header;
