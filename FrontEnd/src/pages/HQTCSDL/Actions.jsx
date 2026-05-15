import { useState } from 'react';
import { Alert, Box, Button, Card, Grid, Paper, Stack, Tab, Tabs, TextField, Typography } from '@mui/material';
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import KeyboardReturnRoundedIcon from '@mui/icons-material/KeyboardReturnRounded';
import InventoryRoundedIcon from '@mui/icons-material/InventoryRounded';
import DeleteSweepRoundedIcon from '@mui/icons-material/DeleteSweepRounded';
import AddTaskRoundedIcon from '@mui/icons-material/AddTaskRounded';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import server from '../../HTTP/httpCommonParam';

const forms = {
  reader: {
    title: 'Cấp thẻ độc giả',
    caption: 'Nhập thông tin chi tiết để tạo thẻ thư viện mới cho độc giả.',
    endpoint: 'hqtcsdl/readers',
    icon: <PersonAddRoundedIcon />,
    fields: [['username', 'Tên đăng nhập', 'text', true], ['password', 'Mật khẩu', 'password', true], ['fullName', 'Họ tên', 'text', true], ['email', 'Email', 'email'], ['phone', 'Số điện thoại', 'text'], ['address', 'Địa chỉ', 'text'], ['expiredAt', 'Ngày hết hạn', 'date']],
  },
  importBook: {
    title: 'Nhập sách',
    caption: 'Ghi nhận phiếu nhập và cộng tồn kho.',
    endpoint: 'hqtcsdl/import-book',
    icon: <InventoryRoundedIcon />,
    fields: [['supplierId', 'Mã nhà cung cấp', 'text', true], ['employeeId', 'Mã nhân viên', 'text', true], ['bookId', 'Mã sách', 'text', true], ['quantity', 'Số lượng', 'number', true], ['price', 'Đơn giá', 'number', true]],
  },
  loan: {
    title: 'Lập phiếu mượn',
    caption: 'Ghi nhận phiếu mượn cho độc giả tại quầy.',
    endpoint: 'hqtcsdl/loans',
    icon: <MenuBookRoundedIcon />,
    fields: [['readerId', 'Mã độc giả', 'text', true], ['employeeId', 'Mã nhân viên', 'text', true], ['dueDate', 'Ngày hẹn trả', 'date', true]],
  },
  loanItem: {
    title: 'Thêm sách vào phiếu',
    caption: 'Kiểm tra tồn kho và xuất mượn sách.',
    endpoint: 'hqtcsdl/loan-items',
    icon: <AddTaskRoundedIcon />,
    fields: [['loanId', 'Mã phiếu mượn', 'text', true], ['bookId', 'Mã sách', 'text', true], ['quantity', 'Số lượng', 'number', true]],
  },
  returnBook: {
    title: 'Nhận trả sách',
    caption: 'Cập nhật phiếu trả, hoàn kho và tính phạt nếu quá hạn.',
    endpoint: 'hqtcsdl/return',
    icon: <KeyboardReturnRoundedIcon />,
    fields: [['loanId', 'Mã phiếu mượn', 'text', true], ['employeeId', 'Mã nhân viên', 'text', true]],
  },
  liquidateBook: {
    title: 'Thanh lý sách',
    caption: 'Ghi nhận sách không còn lưu thông và trừ tồn kho.',
    endpoint: 'hqtcsdl/liquidate-book',
    icon: <DeleteSweepRoundedIcon />,
    fields: [['bookId', 'Mã sách', 'text', true], ['employeeId', 'Mã nhân viên', 'text', true], ['quantity', 'Số lượng', 'number', true], ['reason', 'Lý do thanh lý', 'text']],
  },
};

const tabKeys = ['reader', 'importBook', 'loan', 'loanItem', 'returnBook', 'liquidateBook'];

export default function Actions() {
  const [activeTab, setActiveTab] = useState('reader');
  const [formData, setFormData] = useState({});
  const [status, setStatus] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const activeForm = forms[activeTab];

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: '', message: '' });
    try {
      const params = new URLSearchParams();
      activeForm.fields.forEach(([id]) => {
        if (formData[id] !== undefined && formData[id] !== '') params.append(id, formData[id]);
      });
      const response = await server.post(activeForm.endpoint, params);
      let message = response.data.message || 'Thao tác thành công';
      if (response.data.loanId) message += ` (Mã phiếu: ${response.data.loanId})`;
      setStatus({ type: 'success', message });
      setFormData({});
    } catch (error) {
      setStatus({ type: 'error', message: error.response?.data?.message || 'Lỗi kết nối máy chủ.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography component="h2" sx={{ fontSize: { xs: 28, md: 36 }, fontWeight: 800, color: '#191B23' }}>Giao dịch thư viện</Typography>
        <Typography sx={{ color: '#434655', mt: 0.5 }}>Quản lý mượn trả, đăng ký độc giả, nhập kho và thanh lý sách.</Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={3}>
          <Paper sx={{ borderRadius: 2, border: '1px solid #C3C6D7', overflow: 'hidden', background: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,.10)' }}>
            <Tabs orientation="vertical" variant="scrollable" value={tabKeys.indexOf(activeTab)} onChange={(event, index) => { setActiveTab(tabKeys[index]); setFormData({}); setStatus({ type: '', message: '' }); }} sx={{ '& .MuiTabs-indicator': { left: 0, width: 4, background: '#2563EB' }, '& .MuiTab-root': { alignItems: 'flex-start', minHeight: 58, px: 3, py: 2, borderBottom: '1px solid #E1E2ED', color: '#434655', fontWeight: 700 }, '& .Mui-selected': { color: '#004AC6', background: 'rgba(219,225,255,.42)' } }}>
              {tabKeys.map((key) => <Tab key={key} icon={forms[key].icon} iconPosition="start" label={forms[key].title} />)}
            </Tabs>
          </Paper>
        </Grid>
        <Grid item xs={12} lg={9}>
          <Card component="form" onSubmit={handleSubmit} sx={{ p: { xs: 3, md: 4 }, borderRadius: 2, border: '1px solid #C3C6D7', background: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,.10)' }}>
            <Stack spacing={3}>
              <Box sx={{ pb: 2, borderBottom: '1px solid #C3C6D7' }}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Box sx={{ width: 40, height: 40, borderRadius: 1, display: 'grid', placeItems: 'center', color: '#004AC6', background: '#EDEDF9' }}>{activeForm.icon}</Box>
                  <Typography variant="h3">{activeForm.title}</Typography>
                </Stack>
                <Typography sx={{ mt: 1, color: '#434655', lineHeight: 1.6 }}>{activeForm.caption}</Typography>
              </Box>
              {status.message && <Alert severity={status.type === 'success' ? 'success' : 'error'}>{status.message}</Alert>}
              <Grid container spacing={2.5}>
                {activeForm.fields.map(([id, label, type, isRequired]) => (
                  <Grid item xs={12} md={id === 'address' || id === 'reason' ? 12 : 6} key={id}>
                    {type === 'date' ? (
                      <DatePicker
                        label={label}
                        format="DD/MM/YYYY"
                        value={formData[id] ? dayjs(formData[id]) : null}
                        onChange={(newValue) => setFormData((prev) => ({ ...prev, [id]: newValue ? newValue.format('YYYY-MM-DD') : '' }))}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            required: Boolean(isRequired),
                            sx: { '& .MuiOutlinedInput-root': { borderRadius: 1, background: '#FFFFFF' } }
                          }
                        }}
                      />
                    ) : (
                      <TextField fullWidth required={Boolean(isRequired)} multiline={id === 'address' || id === 'reason'} minRows={id === 'address' || id === 'reason' ? 3 : 1} type={type} name={id} label={label} value={formData[id] || ''} onChange={handleChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1, background: '#FFFFFF' } }} />
                    )}
                  </Grid>
                ))}
              </Grid>
              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="flex-end" spacing={2} sx={{ pt: 2, borderTop: '1px solid #C3C6D7' }}>
                <Button type="button" variant="outlined" onClick={() => setFormData({})} sx={{ borderRadius: 1, borderColor: '#737686', color: '#191B23' }}>Xóa trống</Button>
                <Button type="submit" disabled={submitting} variant="contained" sx={{ borderRadius: 1, background: '#2563EB', color: '#FFFFFF', '&:hover': { background: '#004AC6' } }}>{submitting ? 'Đang xử lý...' : 'Xác nhận'}</Button>
              </Stack>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}
