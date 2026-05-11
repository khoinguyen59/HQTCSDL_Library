import { Avatar, Box, ButtonBase, Typography } from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";

const Header = ({ handleLeftDrawerToggle }) => {
  return (
    <>
      <Box sx={{ width: 260, display: "flex", alignItems: "center", px: 2 }}>
        <ButtonBase disableRipple onClick={handleLeftDrawerToggle}>
          <Avatar variant="circular">
            <MenuRoundedIcon fontSize="medium" />
          </Avatar>
        </ButtonBase>
        <Typography sx={{ ml: 2, fontWeight: 900, letterSpacing: "-0.02em" }}>
          HQTCSDL Library
        </Typography>
      </Box>
      <Box sx={{ flexGrow: 1 }} />
      <Typography sx={{ mr: 3, color: "#64748b", display: { xs: "none", md: "block" } }}>
        Oracle • Transactions • Triggers • Reports
      </Typography>
    </>
  );
};

export default Header;
