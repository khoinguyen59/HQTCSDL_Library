import { createContext, useContext, useReducer } from 'react';
import { actions } from './actions.jsx';

const MenuContext = createContext(true);

const initialState = {
  opened: true,
  id: document.location.pathname.toString().split('/')[1] || 'home',
};

export function MenuContextProvider({ children }) {
  const [menuOpened, dispatch] = useReducer(MenuReducer, initialState);

  return <MenuContext.Provider value={{ menuOpened, dispatch }}>{children}</MenuContext.Provider>;
}

function MenuReducer(state, action) {
  switch (action.type) {
    case actions.TOGGLE_SIDE_DRAWER: {
      return { ...state, opened: !state.opened };
    }
    case actions.OPEN_MENU: {
      return { ...state, id: action.opened };
    }
    default: {
      throw Error(`Unknown action: ${action.type}`);
    }
  }
}

export const useMenu = () => {
  const { menuOpened, dispatch } = useContext(MenuContext);
  if (menuOpened === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return { menuOpened, dispatch };
};
