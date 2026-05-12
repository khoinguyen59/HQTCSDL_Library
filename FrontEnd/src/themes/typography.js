/**
 * Typography used in theme
 * @param {JsonObject} theme theme customization object
 */

export default function themeTypography(theme) {
  const bodyFont = 'Inter, "Fira Sans", "Segoe UI", sans-serif';

  return {
    fontFamily: bodyFont,
    h6: { fontWeight: 700, color: theme.heading, fontSize: '0.75rem' },
    h5: { fontSize: '0.875rem', color: theme.heading, fontWeight: 700 },
    h4: { fontSize: '1rem', color: theme.heading, fontWeight: 700 },
    h3: { fontSize: '1.25rem', lineHeight: 1.4, color: theme.heading, fontWeight: 700 },
    h2: { fontSize: '1.5rem', lineHeight: 1.33, color: theme.heading, fontWeight: 700 },
    h1: { fontSize: '2.25rem', lineHeight: 1.22, color: theme.heading, fontWeight: 800, letterSpacing: '-0.02em' },
    subtitle1: { fontSize: '0.875rem', fontWeight: 700, color: theme.textDark },
    subtitle2: { fontSize: '0.75rem', fontWeight: 500, color: theme.darkTextSecondary },
    caption: { fontSize: '0.75rem', color: theme.darkTextSecondary, fontWeight: 500 },
    body1: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.5 },
    body2: { letterSpacing: '0em', fontWeight: 400, lineHeight: 1.5, color: theme.darkTextPrimary },
    button: { textTransform: 'none', fontWeight: 700 },
    customInput: {
      marginTop: 1,
      marginBottom: 1,
      '& > label': { top: 23, left: 0, color: theme.grey500, '&[data-shrink="false"]': { top: 5 } },
      '& > div > input': { padding: '30.5px 14px 11.5px !important' },
      '& legend': { display: 'none' },
      '& fieldset': { top: 0 },
    },
    mainContent: {
      backgroundColor: theme.background,
      width: '100%',
      minHeight: 'calc(100vh - 88px)',
      flexGrow: 1,
      padding: '20px',
      marginTop: '88px',
      marginRight: '20px',
      borderRadius: `${theme?.customization?.borderRadius}px`,
    },
    menuCaption: { fontSize: '0.75rem', fontWeight: 800, color: theme.heading, padding: '6px', textTransform: 'uppercase', letterSpacing: '.05em', marginTop: '10px' },
    subMenuCaption: { fontSize: '0.6875rem', fontWeight: 500, color: theme.darkTextSecondary, textTransform: 'capitalize' },
    commonAvatar: { cursor: 'pointer', borderRadius: '8px' },
    smallAvatar: { width: '22px', height: '22px', fontSize: '1rem' },
    mediumAvatar: { width: '34px', height: '34px', fontSize: '1.2rem' },
    largeAvatar: { width: '44px', height: '44px', fontSize: '1.5rem' },
  };
}
