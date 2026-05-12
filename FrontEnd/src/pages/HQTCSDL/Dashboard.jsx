import { useEffect, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Card,
    Chip,
    Grid,
    LinearProgress,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import server from '../../HTTP/httpCommonParam';

const endpoints = {
    dashboard: 'hqtcsdl/dashboard',
    books: 'hqtcsdl/books',
    readers: 'hqtcsdl/readers',
    loans: 'hqtcsdl/loans',
};

const metricIcons = {
    books: <AutoStoriesRoundedIcon />,
    readers: <GroupsRoundedIcon />,
    loans: <ReceiptLongRoundedIcon />,
    overdue: <WarningRoundedIcon />,
    fines: <PaymentsRoundedIcon />,
};

function StatCard({ label, value, icon, danger }) {
    return (
        <Card sx={{ p: 3, minHeight: 150, borderRadius: 2, border: `1px solid ${danger ? '#BA1A1A' : '#C3C6D7'}`, background: danger ? 'rgba(255, 218, 214, .28)' : '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,.10)' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                <Typography sx={{ color: danger ? '#BA1A1A' : '#434655', fontSize: 13, textTransform: 'uppercase', letterSpacing: '.04em', fontWeight: 800 }}>{label}</Typography>
                <Box sx={{ width: 40, height: 40, borderRadius: '50%', display: 'grid', placeItems: 'center', color: danger ? '#BA1A1A' : '#004AC6', background: danger ? '#FFDAD6' : '#EDEDF9' }}>{icon}</Box>
            </Stack>
            <Typography sx={{ fontSize: { xs: 34, md: 40 }, lineHeight: 1, fontWeight: 800, color: danger ? '#BA1A1A' : '#191B23' }}>{value}</Typography>
        </Card>
    );
}

function LoanChart({ count }) {
    const values = [40, 65, 85, 50, 70, 30, 15];
    const labels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    return (
        <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid #C3C6D7', background: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,.10)' }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2} sx={{ mb: 4 }}>
                <Box>
                    <Typography variant="h3">Lượng sách mượn trong tuần</Typography>
                    <Typography sx={{ color: '#434655', mt: 0.5 }}>Minh họa nhịp giao dịch, dữ liệu đang mượn hiện tại: {count ?? 0}</Typography>
                </Box>
                <Button startIcon={<CalendarTodayRoundedIcon />} variant="outlined" sx={{ borderRadius: 1, borderColor: '#C3C6D7', color: '#191B23' }}>Tuần này</Button>
            </Stack>
            <Box sx={{ height: 260, display: 'flex', alignItems: 'flex-end', gap: { xs: 1, md: 2 }, borderBottom: '1px solid #C3C6D7', px: { xs: 1, md: 3 }, pb: 2 }}>
                {values.map((value, index) => (
                    <Box key={labels[index]} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ width: '100%', maxWidth: 48, height: `${value * 2}px`, borderRadius: '4px 4px 0 0', background: index === 2 ? '#004AC6' : '#D6E0F1', transition: '160ms ease', '&:hover': { background: '#2563EB' } }} />
                        <Typography sx={{ color: index === 2 ? '#191B23' : '#434655', fontSize: 12, fontWeight: index === 2 ? 800 : 600 }}>{labels[index]}</Typography>
                    </Box>
                ))}
            </Box>
        </Paper>
    );
}

function DataTable({ title, rows, columns }) {
    return (
        <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, overflow: 'hidden', border: '1px solid #C3C6D7', background: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,.10)' }}>
            <Typography variant="h3" sx={{ mb: 2 }}>{title}</Typography>
            <Box sx={{ overflowX: 'auto' }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => <TableCell key={column.key} sx={{ fontWeight: 800, color: '#434655', background: '#F3F3FE' }}>{column.label}</TableCell>)}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => (
                            <TableRow key={row.MASACH || row.MADOCGIA || row.MAPHIEUMUON || index} hover>
                                {columns.map((column) => <TableCell key={column.key}>{column.render ? column.render(row) : row[column.key]}</TableCell>)}
                            </TableRow>
                        ))}
                        {rows.length === 0 && <TableRow><TableCell colSpan={columns.length}>Chưa có dữ liệu.</TableCell></TableRow>}
                    </TableBody>
                </Table>
            </Box>
        </Paper>
    );
}

export default function HQTCDashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [books, setBooks] = useState([]);
    const [readers, setReaders] = useState([]);
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    async function loadData() {
        setError('');
        setLoading(true);
        try {
            const [dashboardRes, booksRes, readersRes, loansRes] = await Promise.all([
                server.get(endpoints.dashboard),
                server.get(endpoints.books),
                server.get(endpoints.readers),
                server.get(endpoints.loans),
            ]);
            setDashboard(dashboardRes.data);
            setBooks(booksRes.data.rows || []);
            setReaders(readersRes.data.rows || []);
            setLoans(loansRes.data.rows || []);
        } catch (err) {
            setError('Không thể tải dữ liệu. Hãy kiểm tra backend, Oracle và các script database.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { loadData(); }, []);

    return (
        <Stack spacing={3}>
            <Box>
                <Typography component="h2" sx={{ fontSize: { xs: 28, md: 36 }, fontWeight: 800, color: '#191B23' }}>Tổng quan hệ thống</Typography>
                <Typography sx={{ color: '#434655', mt: 0.5 }}>Dữ liệu được cập nhật theo thời gian thực từ Oracle.</Typography>
            </Box>
            {loading && <LinearProgress />}
            {error && <Alert severity="warning">{error}</Alert>}
            <Grid container spacing={3}>
                <Grid item xs={12} md={6} xl={2.4}><StatCard label="Tổng số sách" value={dashboard?.totalBooks ?? '-'} icon={metricIcons.books} /></Grid>
                <Grid item xs={12} md={6} xl={2.4}><StatCard label="Độc giả" value={dashboard?.totalReaders ?? '-'} icon={metricIcons.readers} /></Grid>
                <Grid item xs={12} md={6} xl={2.4}><StatCard label="Đang mượn" value={dashboard?.activeLoans ?? '-'} icon={metricIcons.loans} /></Grid>
                <Grid item xs={12} md={6} xl={2.4}><StatCard label="Quá hạn" value={dashboard?.overdueLoans ?? '-'} icon={metricIcons.overdue} danger /></Grid>
                <Grid item xs={12} md={6} xl={2.4}><StatCard label="Phạt chưa thu" value={dashboard?.unpaidFines ?? '-'} icon={metricIcons.fines} /></Grid>
            </Grid>
            <LoanChart count={dashboard?.activeLoans} />
            <DataTable title="Sách và tồn kho" rows={books} columns={[{ key: 'MASACH', label: 'Mã sách' }, { key: 'TENSACH', label: 'Tên sách' }, { key: 'TENDOANHMUC', label: 'Danh mục' }, { key: 'SOLUONGTONG', label: 'Tổng' }, { key: 'SOLUONGCON', label: 'Còn' }]} />
            <DataTable title="Độc giả" rows={readers} columns={[{ key: 'MADOCGIA', label: 'Mã độc giả' }, { key: 'HOTEN', label: 'Họ tên' }, { key: 'EMAIL', label: 'Email' }, { key: 'TRANGTHAI', label: 'Trạng thái', render: (row) => <Chip size="small" label={row.TRANGTHAI} /> }]} />
            <DataTable title="Phiếu mượn" rows={loans} columns={[{ key: 'MAPHIEUMUON', label: 'Mã phiếu' }, { key: 'TENDOCGIA', label: 'Độc giả' }, { key: 'TENNHANVIEN', label: 'Nhân viên' }, { key: 'TRANGTHAI', label: 'Trạng thái', render: (row) => <Chip size="small" color={row.TRANGTHAI === 'QUA_HAN' ? 'error' : 'default'} label={row.TRANGTHAI} /> }, { key: 'DANHSACHSACH', label: 'Sách mượn' }]} />
        </Stack>
    );
}
