import { useEffect, useState } from 'react';
import { Alert, Box, Button, Card, Chip, Grid, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import server from '../../HTTP/httpCommonParam';

const endpoints = {
  dashboard: 'hqtcsdl/dashboard',
  books: 'hqtcsdl/books',
  readers: 'hqtcsdl/readers',
  loans: 'hqtcsdl/loans'
};

function StatCard({ label, value, tone }) {
  return (
    <Card sx={{ p: 3, borderRadius: 4, background: tone, minHeight: 130 }}>
      <Typography sx={{ color: '#475569', fontWeight: 700 }}>{label}</Typography>
      <Typography sx={{ mt: 1, fontSize: 42, fontWeight: 900, color: '#0f172a' }}>{value}</Typography>
    </Card>
  );
}

function DataTable({ title, rows, columns }) {
  return (
    <Paper sx={{ p: 3, borderRadius: 4, overflow: 'hidden' }}>
      <Typography variant='h3' sx={{ mb: 2 }}>{title}</Typography>
      <Box sx={{ overflowX: 'auto' }}>
        <Table size='small'>
          <TableHead>
            <TableRow>
              {columns.map((column) => <TableCell key={column.key}>{column.label}</TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={row.MASACH || row.MADOCGIA || row.MAPHIEUMUON || index}>
                {columns.map((column) => <TableCell key={column.key}>{column.render ? column.render(row) : row[column.key]}</TableCell>)}
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length}>Chưa có dữ liệu.</TableCell>
              </TableRow>
            )}
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
  const [error, setError] = useState('');

  async function loadData() {
    setError('');
    try {
      const [dashboardRes, booksRes, readersRes, loansRes] = await Promise.all([
        server.get(endpoints.dashboard),
        server.get(endpoints.books),
        server.get(endpoints.readers),
        server.get(endpoints.loans)
      ]);
      setDashboard(dashboardRes.data);
      setBooks(booksRes.data.rows || []);
      setReaders(readersRes.data.rows || []);
      setLoans(loansRes.data.rows || []);
    } catch (err) {
      setError('Không thể tải dữ liệu. Hãy kiểm tra backend, Oracle và các script database đã chạy đúng thứ tự.');
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Stack spacing={3}>
      <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 5, background: 'linear-gradient(135deg, #102a43, #486581)', color: '#fff' }}>
        <Typography sx={{ fontSize: { xs: 34, md: 52 }, fontWeight: 900, letterSpacing: '-0.03em' }}>
          Bảng điều khiển HQTCSDL
        </Typography>
        <Typography sx={{ mt: 2, maxWidth: 900, fontSize: 17, lineHeight: 1.8 }}>
          Màn hình này dùng các API mới `/db-api/hqtcsdl/*`, phục vụ trực tiếp cho demo đồ án: sách, độc giả,
          phiếu mượn, tồn kho, quá hạn và tiền phạt.
        </Typography>
        <Button onClick={loadData} variant='contained' color='warning' sx={{ mt: 3 }}>Tải lại dữ liệu</Button>
      </Paper>

      {error && <Alert severity='warning'>{error}</Alert>}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={2.4}><StatCard label='Đầu sách' value={dashboard?.totalBooks ?? '-'} tone='#fef3c7' /></Grid>
        <Grid item xs={12} sm={6} md={2.4}><StatCard label='Độc giả' value={dashboard?.totalReaders ?? '-'} tone='#dbeafe' /></Grid>
        <Grid item xs={12} sm={6} md={2.4}><StatCard label='Đang mượn' value={dashboard?.activeLoans ?? '-'} tone='#dcfce7' /></Grid>
        <Grid item xs={12} sm={6} md={2.4}><StatCard label='Quá hạn' value={dashboard?.overdueLoans ?? '-'} tone='#fee2e2' /></Grid>
        <Grid item xs={12} sm={6} md={2.4}><StatCard label='Phạt chưa thu' value={dashboard?.unpaidFines ?? '-'} tone='#ede9fe' /></Grid>
      </Grid>

      <DataTable
        title='Sách và tồn kho'
        rows={books}
        columns={[
          { key: 'MASACH', label: 'Mã sách' },
          { key: 'TENSACH', label: 'Tên sách' },
          { key: 'TENDANHMUC', label: 'Danh mục' },
          { key: 'SOLUONGTONG', label: 'Tổng' },
          { key: 'SOLUONGCON', label: 'Còn' }
        ]}
      />

      <DataTable
        title='Độc giả'
        rows={readers}
        columns={[
          { key: 'MADOCGIA', label: 'Mã độc giả' },
          { key: 'HOTEN', label: 'Họ tên' },
          { key: 'EMAIL', label: 'Email' },
          { key: 'TRANGTHAI', label: 'Trạng thái', render: (row) => <Chip size='small' label={row.TRANGTHAI} /> }
        ]}
      />

      <DataTable
        title='Phiếu mượn'
        rows={loans}
        columns={[
          { key: 'MAPHIEUMUON', label: 'Mã phiếu' },
          { key: 'TENDOCGIA', label: 'Độc giả' },
          { key: 'TENNHANVIEN', label: 'Nhân viên' },
          { key: 'TRANGTHAI', label: 'Trạng thái', render: (row) => <Chip size='small' color={row.TRANGTHAI === 'QUA_HAN' ? 'error' : 'default'} label={row.TRANGTHAI} /> },
          { key: 'DANHSACHSACH', label: 'Sách mượn' }
        ]}
      />
    </Stack>
  );
}
