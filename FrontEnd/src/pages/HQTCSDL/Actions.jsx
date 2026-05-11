import { useState } from 'react';
import { Alert, Button, Card, Grid, Stack, TextField, Typography } from '@mui/material';
import server from '../../HTTP/httpCommonParam';

const forms = {
  reader: {
    title: 'Đăng ký độc giả',
    endpoint: 'hqtcsdl/readers',
    fields: [
      ['username', 'Tên đăng nhập'],
      ['password', 'Mật khẩu'],
      ['fullName', 'Họ tên'],
      ['email', 'Email'],
      ['phone', 'Số điện thoại'],
      ['address', 'Địa chỉ'],
      ['expiredAt', 'Ngày hết hạn, ví dụ 2027-12-31']
    ]
  },
  loan: {
    title: 'Tạo phiếu mượn',
    endpoint: 'hqtcsdl/loans',
    fields: [
      ['readerId', 'Mã độc giả'],
      ['employeeId', 'Mã nhân viên'],
      ['dueDate', 'Ngày hẹn trả, ví dụ 2026-06-01']
    ]
  },
  loanItem: {
    title: 'Thêm sách vào phiếu mượn',
    endpoint: 'hqtcsdl/loan-items',
    fields: [
      ['loanId', 'Mã phiếu mượn'],
      ['bookId', 'Mã sách'],
      ['quantity', 'Số lượng']
    ]
  },
  returnBook: {
    title: 'Trả sách',
    endpoint: 'hqtcsdl/return',
    fields: [
      ['loanId', 'Mã phiếu mượn'],
      ['employeeId', 'Mã nhân viên']
    ]
  },
  importBook: {
    title: 'Nhập sách',
    endpoint: 'hqtcsdl/import-book',
    fields: [
      ['supplierId', 'Mã nhà cung cấp'],
      ['employeeId', 'Mã nhân viên'],
      ['bookId', 'Mã sách'],
      ['quantity', 'Số lượng'],
      ['price', 'Đơn giá']
    ]
  }
};

function DemoForm({ config }) {
  const [data, setData] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    setMessage('');
    setError('');
    try {
      const body = new URLSearchParams(data);
      const res = await server.post(config.endpoint, body);
      setMessage(res.data.message || 'Thao tác thành công');
    } catch (err) {
      setError('Thao tác thất bại. Kiểm tra dữ liệu nhập hoặc trạng thái database.');
    }
  }

  return (
    <Card component='form' onSubmit={submit} sx={{ p: 3, borderRadius: 4, height: '100%' }}>
      <Typography variant='h3' sx={{ mb: 2 }}>{config.title}</Typography>
      <Stack spacing={2}>
        {config.fields.map(([name, label]) => (
          <TextField
            key={name}
            size='small'
            label={label}
            value={data[name] || ''}
            onChange={(event) => setData((prev) => ({ ...prev, [name]: event.target.value }))}
          />
        ))}
        <Button type='submit' variant='contained' color='warning'>Gửi</Button>
        {message && <Alert severity='success'>{message}</Alert>}
        {error && <Alert severity='error'>{error}</Alert>}
      </Stack>
    </Card>
  );
}

export default function HQTCDemoActions() {
  return (
    <Stack spacing={3}>
      <Typography sx={{ fontSize: 42, fontWeight: 900 }}>Thao tác demo HQTCSDL</Typography>
      <Typography sx={{ color: '#475569', maxWidth: 900 }}>
        Các form này gọi trực tiếp API `/db-api/hqtcsdl/*` để demo stored procedure trên Oracle. Dùng dữ liệu mẫu từ
        `03_HQTCSDL_Demo_Data.sql` hoặc dữ liệu bạn tự nhập.
      </Typography>
      <Grid container spacing={3}>
        {Object.values(forms).map((config) => (
          <Grid item xs={12} md={6} key={config.title}>
            <DemoForm config={config} />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
