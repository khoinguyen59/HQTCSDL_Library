import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Card, Stack, TextField, Typography, Alert } from '@mui/material';
import server from '../../HTTP/httpCommonParam';
import { useAuth } from '../../contexts/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await server.post('api/auth/login', new URLSearchParams({
        username,
        password
      }));

      const { token, user } = response.data;
      login(token, user);
      
      // Redirect to HQTCSDL dashboard
      navigate('/hqtcsdl');
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi kết nối máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#F4F6F8', p: 2 }}>
      <Card sx={{ maxWidth: 400, width: '100%', p: 4, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <Stack spacing={3} component="form" onSubmit={handleSubmit}>
          <Box textAlign="center">
            <Typography variant="h4" fontWeight="bold" color="primary">Đăng nhập</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Hệ thống quản lý thư viện</Typography>
          </Box>

          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Tên đăng nhập"
            variant="outlined"
            fullWidth
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          
          <TextField
            label="Mật khẩu"
            type="password"
            variant="outlined"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? 'Đang xác thực...' : 'Đăng nhập'}
          </Button>
        </Stack>
      </Card>
    </Box>
  );
}
