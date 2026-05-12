import { Box, Button, Card, Grid, Paper, Stack, Typography } from '@mui/material';
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import SummarizeRoundedIcon from '@mui/icons-material/SummarizeRounded';
import { Link } from 'react-router-dom';

const quickActions = [
    { title: 'Lập phiếu mượn nhanh', body: 'Tạo mới giao dịch mượn sách tại quầy.', icon: <AssignmentTurnedInRoundedIcon />, to: '/hqtcsdl/actions' },
    { title: 'Tra cứu độc giả', body: 'Xem trạng thái thẻ và lịch sử mượn trả.', icon: <GroupsRoundedIcon />, to: '/hqtcsdl' },
    { title: 'Báo cáo cuối ngày', body: 'Tổng hợp mượn/trả, quá hạn và tồn kho.', icon: <SummarizeRoundedIcon />, to: '/stat' },
];

const metrics = [
    { label: 'Quản lý mượn - trả', icon: <AssignmentTurnedInRoundedIcon />, copy: 'Theo dõi phiếu mượn, phiếu trả và trạng thái quá hạn.' },
    { label: 'Kho sách', icon: <AutoStoriesRoundedIcon />, copy: 'Kiểm soát tồn kho, nhập sách và vị trí kệ.' },
    { label: 'Độc giả', icon: <GroupsRoundedIcon />, copy: 'Quản lý hồ sơ độc giả và phân quyền.' },
    { label: 'Vi phạm', icon: <WarningAmberRoundedIcon />, copy: 'Tự động tính phạt và ghi nhận vi phạm.' },
];

function Hero() {
    return (
        <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 2, border: '1px solid #C3C6D7', background: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,.10)' }}>
            <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} lg={7}>
                    <Typography sx={{ color: '#004AC6', fontWeight: 800, mb: 1 }}>Oracle Library Management System</Typography>
                    <Typography component="h1" sx={{ fontSize: { xs: 34, md: 48 }, lineHeight: 1.08, fontWeight: 800, letterSpacing: '-0.03em', color: '#191B23' }}>
                        Quản lý thư viện tập trung cho đồ án HQTCSDL
                    </Typography>
                    <Typography sx={{ mt: 2, maxWidth: 760, color: '#434655', fontSize: 16, lineHeight: 1.7 }}>
                        Giao diện được đồng bộ theo mẫu Stitch: điều hướng cố định, bề mặt Material, dashboard dữ liệu và trung tâm giao dịch thủ thư kết nối trực tiếp Oracle.
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4 }}>
                        <Button component={Link} to="/hqtcsdl" variant="contained" sx={{ minHeight: 44, borderRadius: 1, background: '#2563EB', color: '#FFFFFF', '&:hover': { background: '#004AC6' } }}>
                            Mở tổng quan
                        </Button>
                        <Button component={Link} to="/hqtcsdl/actions" variant="outlined" sx={{ minHeight: 44, borderRadius: 1, borderColor: '#737686', color: '#191B23', '&:hover': { background: '#F3F3FE', borderColor: '#004AC6' } }}>
                            Giao dịch thư viện
                        </Button>
                    </Stack>
                </Grid>
                <Grid item xs={12} lg={5}>
                    <Box sx={{ border: '1px solid #C3C6D7', borderRadius: 2, overflow: 'hidden', background: '#F9FAFB' }}>
                        <Box sx={{ px: 3, py: 2, borderBottom: '1px solid #C3C6D7', display: 'flex', alignItems: 'center', gap: 1 }}>
                            <SearchRoundedIcon sx={{ color: '#004AC6' }} />
                            <Typography sx={{ fontWeight: 800 }}>Tra cứu nhanh OPAC</Typography>
                        </Box>
                        {['Sách sẵn sàng', 'Phiếu đang mượn', 'Độc giả hoạt động', 'Cảnh báo quá hạn'].map((item, index) => (
                            <Box key={item} sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'space-between', borderBottom: index < 3 ? '1px solid #E1E2ED' : 'none' }}>
                                <Typography sx={{ color: '#434655' }}>{item}</Typography>
                                <Typography sx={{ fontWeight: 800, color: index === 3 ? '#BA1A1A' : '#004AC6' }}>{index === 3 ? 'Live' : 'OK'}</Typography>
                            </Box>
                        ))}
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );
}

export default function Home() {
    return (
        <Stack spacing={3}>
            <Hero />
            <Grid container spacing={3}>
                {metrics.map((item) => (
                    <Grid item xs={12} md={6} xl={3} key={item.label}>
                        <Card sx={{ p: 3, height: '100%', borderRadius: 2, border: '1px solid #C3C6D7', background: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,.10)' }}>
                            <Box sx={{ width: 44, height: 44, borderRadius: 2, display: 'grid', placeItems: 'center', background: '#EDEDF9', color: '#004AC6', mb: 2 }}>{item.icon}</Box>
                            <Typography variant="h3">{item.label}</Typography>
                            <Typography sx={{ mt: 1, color: '#434655', lineHeight: 1.6 }}>{item.copy}</Typography>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Grid container spacing={3}>
                {quickActions.map((item) => (
                    <Grid item xs={12} md={4} key={item.title}>
                        <Card sx={{ p: 3, height: '100%', borderRadius: 2, border: '1px solid #C3C6D7', background: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,.10)' }}>
                            <Box sx={{ width: 48, height: 48, borderRadius: 2, display: 'grid', placeItems: 'center', background: '#DBE1FF', color: '#00174B', mb: 2 }}>{item.icon}</Box>
                            <Typography variant="h3">{item.title}</Typography>
                            <Typography sx={{ mt: 1, color: '#434655', minHeight: 48 }}>{item.body}</Typography>
                            <Button component={Link} to={item.to} fullWidth sx={{ mt: 2, borderRadius: 1, background: '#2563EB', color: '#FFFFFF', '&:hover': { background: '#004AC6' } }}>
                                Truy cập
                            </Button>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Stack>
    );
}
