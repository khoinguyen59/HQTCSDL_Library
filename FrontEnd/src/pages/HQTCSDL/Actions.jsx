import { useState } from 'react';
import { Alert, Box, Button, Card, Grid, Paper, Stack, Tab, Tabs, TextField, Typography } from '@mui/material';
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import KeyboardReturnRoundedIcon from '@mui/icons-material/KeyboardReturnRounded';
import InventoryRoundedIcon from '@mui/icons-material/InventoryRounded';
import DeleteSweepRoundedIcon from '@mui/icons-material/DeleteSweepRounded';
import AddTaskRoundedIcon from '@mui/icons-material/AddTaskRounded';
import server from '../../HTTP/httpCommonParam';

const forms = {
  reader: {
    title: 'Cap the doc gia',
    caption: 'Nhap thong tin chi tiet de tao the thu vien moi cho doc gia.',
    endpoint: 'hqtcsdl/readers',
    icon: <PersonAddRoundedIcon />,
    fields: [['username', 'Ten dang nhap', 'text', true], ['password', 'Mat khau', 'password', true], ['fullName', 'Ho ten', 'text', true], ['email', 'Email', 'email'], ['phone', 'So dien thoai', 'text'], ['address', 'Dia chi', 'text'], ['expiredAt', 'Ngay het han', 'date']],
  },
  importBook: {
    title: 'Nhap sach',
    caption: 'Ghi nhan phieu nhap va cong ton kho.',
    endpoint: 'hqtcsdl/import-book',
    icon: <InventoryRoundedIcon />,
    fields: [['supplierId', 'Ma nha cung cap', 'text', true], ['employeeId', 'Ma nhan vien', 'text', true], ['bookId', 'Ma sach', 'text', true], ['quantity', 'So luong', 'number', true], ['price', 'Don gia', 'number', true]],
  },
  loan: {
    title: 'Lap phieu muon',
    caption: 'Ghi nhan phieu muon cho doc gia tai quay.',
    endpoint: 'hqtcsdl/loans',
    icon: <MenuBookRoundedIcon />,
    fields: [['readerId', 'Ma doc gia', 'text', true], ['employeeId', 'Ma nhan vien', 'text', true], ['dueDate', 'Ngay hen tra', 'date', true]],
  },
  loanItem: {
    title: 'Them sach vao phieu',
    caption: 'Kiem tra ton kho va xuat muon sach.',
    endpoint: 'hqtcsdl/loan-items',
    icon: <AddTaskRoundedIcon />,
    fields: [['loanId', 'Ma phieu muon', 'text', true], ['bookId', 'Ma sach', 'text', true], ['quantity', 'So luong', 'number', true]],
  },
  returnBook: {
    title: 'Nhan tra sach',
    caption: 'Cap nhat phieu tra, hoan kho va tinh phat neu qua han.',
    endpoint: 'hqtcsdl/return',
    icon: <KeyboardReturnRoundedIcon />,
    fields: [['loanId', 'Ma phieu muon', 'text', true], ['employeeId', 'Ma nhan vien', 'text', true]],
  },
  liquidateBook: {
    title: 'Thanh ly sach',
    caption: 'Ghi nhan sach khong con luu thong va tru ton kho.',
    endpoint: 'hqtcsdl/liquidate-book',
    icon: <DeleteSweepRoundedIcon />,
    fields: [['bookId', 'Ma sach', 'text', true], ['employeeId', 'Ma nhan vien', 'text', true], ['quantity', 'So luong', 'number', true], ['reason', 'Ly do thanh ly', 'text']],
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
      let message = response.data.message || 'Thao tac thanh cong';
      if (response.data.loanId) message += ` (Ma phieu: ${response.data.loanId})`;
      setStatus({ type: 'success', message });
      setFormData({});
    } catch (error) {
      setStatus({ type: 'error', message: error.response?.data?.message || 'Loi ket noi may chu.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography component="h2" sx={{ fontSize: { xs: 28, md: 36 }, fontWeight: 800, color: '#191B23' }}>Giao dich thu vien</Typography>
        <Typography sx={{ color: '#434655', mt: 0.5 }}>Quan ly muon tra, dang ky doc gia, nhap kho va thanh ly sach.</Typography>
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
                    <TextField fullWidth required={Boolean(isRequired)} multiline={id === 'address' || id === 'reason'} minRows={id === 'address' || id === 'reason' ? 3 : 1} type={type} name={id} label={label} value={formData[id] || ''} onChange={handleChange} InputLabelProps={type === 'date' ? { shrink: true } : undefined} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1, background: '#FFFFFF' } }} />
                  </Grid>
                ))}
              </Grid>
              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="flex-end" spacing={2} sx={{ pt: 2, borderTop: '1px solid #C3C6D7' }}>
                <Button type="button" variant="outlined" onClick={() => setFormData({})} sx={{ borderRadius: 1, borderColor: '#737686', color: '#191B23' }}>Xoa trong</Button>
                <Button type="submit" disabled={submitting} variant="contained" sx={{ borderRadius: 1, background: '#2563EB', color: '#FFFFFF', '&:hover': { background: '#004AC6' } }}>{submitting ? 'Dang xu ly...' : 'Xac nhan'}</Button>
              </Stack>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}
