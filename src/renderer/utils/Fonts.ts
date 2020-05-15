import { createGlobalStyle } from "styled-components";

export const Fonts = createGlobalStyle`
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 300;
  font-display: swap;
  src: url('./assets/fonts/Roboto-Light.ttf') format('opentype');
}
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('./assets/fonts/Roboto-Regular.ttf') format('opentype');
}
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url('./assets/fonts/Roboto-Medium.ttf') format('opentype');
}
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url('./assets/fonts/Roboto-Bold.ttf') format('opentype');
}`