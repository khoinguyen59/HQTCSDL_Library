import { Box, Button, Card, Grid, Paper, Stack, Typography } from '@mui/material';
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import SavingsRoundedIcon from '@mui/icons-material/SavingsRounded';
import { Link } from 'react-router-dom';

const metrics = [
  {
    title: 'Quản lý mượn - trả',
    description: 'Theo dõi phiếu mượn, phiếu trả, tình trạng quá hạn và vi phạm ngay trên Oracle.',
    icon: <AssignmentTurnedInRoundedIcon sx={{ fontSize: 38 }} />,
    to: '/hqtcsdl'
  },
  {
    title: 'Tồn kho thư viện',
    description: 'Kiểm soát số lượng tổng, số lượng còn và luồng nhập sách cho từng đầu sách.',
    icon: <AutoStoriesRoundedIcon sx={{ fontSize: 38 }} />,
    to: '/hqtcsdl'
  },
  {
    title: 'Độc giả và phân quyền',
    description: 'Tách vai trò độc giả, thủ thư, quản lý và quản trị viên để bám sát yêu cầu đồ án.',
    icon: <GroupsRoundedIcon sx={{ fontSize: 38 }} />,
    to: '/hqtcsdl/actions'
  },
  {
    title: 'Xử lý quá hạn và tiền phạt',
    description: 'Tự động tính tiền phạt, ghi nhận vi phạm và hỗ trợ báo cáo thống kê vận hành.',
    icon: <WarningAmberRoundedIcon sx={{ fontSize: 38 }} />,
    to: '/stat'
  }
];

const sections = [
  {
    title: 'Bám sát đề tài HQTCSDL',
    body: 'Ứng dụng được định hướng lại thành hệ thống quản lý thư viện trường học trên Oracle, tập trung vào mô hình dữ liệu quan hệ, giao tác, trigger, stored procedure và xử lý đồng thời theo đúng tinh thần môn học.'
  },
  {
    title: 'Tập trung nghiệp vụ trọng tâm',
    body: 'Ứng dụng tập trung vào nghiệp vụ mượn-trả, kho sách, phạt quá hạn, nhập sách và báo cáo để bám sát yêu cầu môn học.'
  },
  {
    title: 'Sẵn sàng cho phần báo cáo',
    body: 'Bộ script Oracle riêng đã được tách thành schema, procedures/triggers, dữ liệu mẫu và kịch bản đồng thời T1/T2 để phục vụ trực tiếp cho báo cáo và buổi demo.'
  }
];

function Hero() {
  return (
    <Paper
      elevation={0}
      sx={{
        overflow: 'hidden',
        position: 'relative',
        borderRadius: 5,
        px: { xs: 3, md: 8 },
        py: { xs: 6, md: 10 },
        color: '#0f172a',
        background: 'linear-gradient(135deg, #f7f1d5 0%, #f2d399 45%, #d9e6f2 100%)'
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: -50,
          right: -30,
          width: 220,
          height: 220,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.32)'
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -60,
          left: -20,
          width: 180,
          height: 180,
          borderRadius: '50%',
          background: 'rgba(180, 132, 59, 0.18)'
        }}
      />
      <Grid container spacing={4} alignItems='center'>
        <Grid item xs={12} md={7}>
          <Typography
            sx={{
              fontSize: { xs: 38, md: 58 },
              lineHeight: 1.05,
              fontWeight: 800,
              letterSpacing: '-0.03em'
            }}
          >
            Hệ thống quản lý thư viện cho đồ án HQTCSDL
          </Typography>
          <Typography sx={{ mt: 3, maxWidth: 720, fontSize: 18, lineHeight: 1.8 }}>
            Đây là phiên bản triển khai lại từ khung ban đầu để phục vụ đúng yêu cầu học phần: quản lý sách,
            kho sách, phiếu mượn, phiếu trả, vi phạm, nhập sách, báo cáo và các kịch bản xử lý đồng thời trên Oracle.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4 }}>
            <Button component={Link} to='/hqtcsdl' variant='contained' color='warning' size='large'>
              Xem danh mục sách
            </Button>
            <Button component={Link} to='/stat' variant='outlined' color='inherit' size='large'>
              Xem thống kê
            </Button>
          </Stack>
        </Grid>
        <Grid item xs={12} md={5}>
          <Card
            sx={{
              p: 4,
              borderRadius: 4,
              background: 'rgba(255,255,255,0.82)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Typography variant='h3' sx={{ mb: 2 }}>
              Trọng tâm triển khai
            </Typography>
            <Stack spacing={2}>
              <Typography>• Oracle schema đúng theo đề tài thư viện.</Typography>
              <Typography>• Stored procedure và trigger cho nghiệp vụ chính.</Typography>
              <Typography>• Mô phỏng Lost Update, Deadlock và các lỗi đồng thời khác.</Typography>
              <Typography>• Tách vai trò độc giả, thủ thư, quản lý và quản trị viên.</Typography>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Paper>
  );
}

function CapabilityCards() {
  return (
    <Grid container spacing={3} sx={{ mt: 1 }}>
      {metrics.map((item) => (
        <Grid item xs={12} sm={6} key={item.title}>
          <Card sx={{ p: 3, minHeight: 220, borderRadius: 4, boxShadow: '0 18px 40px rgba(15, 23, 42, 0.10)' }}>
            <Box sx={{ color: '#9a5b13', mb: 2 }}>{item.icon}</Box>
            <Typography variant='h3' sx={{ mb: 1.5 }}>
              {item.title}
            </Typography>
            <Typography sx={{ minHeight: 72, lineHeight: 1.7, color: '#475569' }}>
              {item.description}
            </Typography>
            <Button component={Link} to={item.to} sx={{ mt: 2, px: 0 }} color='warning'>
              Truy cập chức năng
            </Button>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

function ProjectSections() {
  return (
    <Grid container spacing={3} sx={{ mt: 2 }}>
      {sections.map((section) => (
        <Grid item xs={12} md={4} key={section.title}>
          <Paper sx={{ p: 3, height: '100%', borderRadius: 4, background: '#fffaf2' }}>
            <Typography variant='h3' sx={{ mb: 2 }}>
              {section.title}
            </Typography>
            <Typography sx={{ lineHeight: 1.8, color: '#4b5563' }}>{section.body}</Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}

export default function Home() {
  return (
    <Stack spacing={4}>
      <Hero />
      <CapabilityCards />
      <ProjectSections />
    </Stack>
  );
}

