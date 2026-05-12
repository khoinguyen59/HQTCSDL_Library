import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Chip, ListItemButton, ListItemIcon, ListItemText, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { actions } from '../../../contexts/actions';
import { useMenu } from '../../../contexts/MenuContextProvider';

const NavItem = ({ item, level }) => {
  const theme = useTheme();
  const { menuOpened, dispatch } = useMenu();
  const matchesSM = useMediaQuery(theme.breakpoints.down('md'));
  const itemIcon = item?.icon;

  const listItemProps = {
    component: forwardRef((props, ref) => <Link ref={ref} {...props} to={item.url} />),
  };

  const itemHandler = (id) => {
    dispatch({ type: actions.OPEN_MENU, opened: id });
    if (matchesSM) dispatch({ type: actions.TOGGLE_SIDE_DRAWER });
  };

  return (
    <ListItemButton
      {...listItemProps}
      disabled={item.disabled}
      sx={{
        borderRadius: 2,
        mb: 0.5,
        alignItems: 'center',
        backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
        py: level > 1 ? 1 : 1.25,
        pl: `${level * 16}px`,
      }}
      selected={menuOpened.id === item.id}
      onClick={() => itemHandler(item.id)}
    >
      <ListItemIcon sx={{ my: 'auto', minWidth: !item?.icon ? 18 : 36 }}>{itemIcon}</ListItemIcon>
      <ListItemText
        primary={
          <Typography variant={menuOpened.id === item.id ? 'h5' : 'body1'} color="inherit">
            {item.title}
          </Typography>
        }
        secondary={
          item.caption && (
            <Typography variant="caption" sx={{ ...theme.typography.subMenuCaption }} display="block" gutterBottom>
              {item.caption}
            </Typography>
          )
        }
      />
      {item.chip && (
        <Chip
          color={item.chip.color}
          variant={item.chip.variant}
          size={item.chip.size}
          label={item.chip.label}
          avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
        />
      )}
    </ListItemButton>
  );
};

export default NavItem;
