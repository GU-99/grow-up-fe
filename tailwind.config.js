/** @type {import('tailwindcss').Config} */

export const customSpacing = {};
for (let i = 0; i <= 400; i++) {
  customSpacing[i] = `${(i * 0.1).toFixed(1)}rem`;
}

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      spacing: customSpacing,
      height: {
        header: 'var(--height-header)',
        contents: 'var(--height-contents)',
        input: 'var(--height-input)',
      },
      size: {
        'header-icon': 'var(--size-header-icon)',
        'regular-icon': 'var(--size-regular-icon)',
        '404-icon': 'var(--size-404-icon)',
        'signup-img': 'var(--size-signup-img)',
      },
      width: {
        input: 'var(--width-input)',
        'min-popup': 'var(--width-min-popup)',
      },
      margin: {
        'contents-layout': 'var(--margin-contents-layout)',
        'x-input': 'var(--margin-x-input)',
        'y-input': 'var(--margin-y-input)',
        'b-popup-list': 'var(--margin-b-popup-list)',
        'r-contents-box': 'var(--margin-r-contents-box)',
      },
      padding: {
        'x-input': 'var(--padding-x-input)',
      },
      fontFamily: {
        roboto: 'var(--font-family-roboto)',
      },
      fontSize: {
        regular: 'var(--font-size-regular)',
        bold: 'var(--font-size-bold)',
        404: 'var(--font-size-404)',
      },
      fontWeight: {
        regular: 'var(--font-weight-regular)',
        bold: 'var(--font-weight-bold)',
        404: 'var(--font-weight-404)',
      },
      letterSpacing: {
        'narrow-large': 'var(--narrow-spacing-large)',
        'narrow-regular': 'var(--narrow-spacing-regular)',
      },
      borderRadius: {
        10: 'var(--border-radius-10)',
      },
      borderColor: {
        list: 'var(--border-list)',
        input: 'var(--border-input)',
        scroll: 'var(--border-scroll)',
      },
      textColor: {
        default: 'var(--text-color-default)',
        bold: 'var(--text-color-bold)',
        error: 'var(--text-color-error)',
        blue: 'var(--text-color-blue)',
      },
      colors: {
        main: 'var(--color-main)',
        sub: 'var(--color-sub)',
        close: 'var(--color-close)',
        'contents-box': 'var(--color-contents-box)',
        disable: 'var(--color-disable)',
        selected: 'var(--color-selected)',
        scroll: 'var(--color-scroll)',
        kako: 'var(--color-kakao)',
        todo: {
          red: 'var(--color-todo-red)',
          yellow: 'var(--color-todo-yellow)',
          green: 'var(--color-todo-green)',
          blue: 'var(--color-todo-blue)',
          orange: 'var(--color-todo-orange)',
          purple: 'var(--color-todo-purple)',
          'yellow-green': 'var(--color-todo-yellow-green)',
          gray: 'var(--color-todo-gray)',
        },
      },
    },
  },
  plugins: [],
};
