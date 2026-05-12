import { createTheme } from '@mui/material/styles';
import colors from '../assets/scss/_themes-vars.module.scss';
import componentStyleOverrides from './compStyleOverride';
import themePalette from './palette';
import themeTypography from './typography';

export const Theme = (mode) => {
  const color = colors;
  const themeOption = {
    colors: color,
    heading: mode === 'light' ? '#191B23' : color.grey50,
    paper: mode === 'light' ? '#FFFFFF' : color.darkPaper,
    backgroundDefault: mode === 'light' ? '#FAF8FF' : colors?.darkBackground,
    background: mode === 'light' ? '#FAF8FF' : colors?.darkPaper,
    backgroundComponent: mode === 'light' ? '#EDEDF9' : color.grey600,
    darkTextPrimary: mode === 'light' ? '#191B23' : color.grey50,
    darkTextSecondary: mode === 'light' ? '#434655' : color.grey500,
    textDark: mode === 'light' ? '#191B23' : color.grey50,
    menuSelectedBack: mode === 'light' ? '#D6E0F1' : color.grey100,
    menuSelected: mode === 'light' ? '#004AC6' : color.grey900,
    divider: mode === 'light' ? '#C3C6D7' : color.grey800,
    itemBackgroundHover: mode === 'light' ? '#EDEDF9' : color.grey600,
    buttonBackground: mode === 'light' ? '#2563EB' : color.darkButton,
    itemBackground: mode === 'light' ? '#FFFFFF' : color.darkPaper,
  };

  const themeOptions = {
    direction: 'ltr',
    palette: themePalette(themeOption, mode),
    mixins: { toolbar: { minHeight: '48px', padding: '16px', '@media (min-width: 600px)': { minHeight: '48px' } } },
    typography: themeTypography(themeOption),
    shape: { borderRadius: 8 },
    transitions: { duration: { enteringScreen: 180, leavingScreen: 150 } },
  };

  const themes = createTheme(themeOptions);
  themes.components = componentStyleOverrides(themeOption);
  return themes;
};

export default Theme;
