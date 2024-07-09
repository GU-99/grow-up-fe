/** @type {import('tailwindcss').Config} */

export const customSpacing = {};
for (let i = 0; i <= 400; i++) {
  customSpacing[i] = `${(i * 0.1).toFixed(1)}rem`;
}

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    letterSpacing: {
      tighter: 'var(--narrow-spacing-large)',
      tight: 'var(--narrow-spacing-regular)',
    },
    extend: {
      spacing: customSpacing,
      height: {
        header: 'var(--height-header)',
        contents: 'var(--height-contents)',
      },
      maxWidth: {
        contents: 'var(--max-width-contents)',
      },
      fontFamily: {
        roboto: 'var(--font-family-roboto)',
      },
      fontSize: {
        regular: 'var(--font-size-regular)',
        large: 'var(--font-size-large)',
        404: 'var(--font-size-404)',
      },
      fontWeight: {
        regular: 'var(--font-weight-regular)',
        bold: 'var(--font-weight-bold)',
        404: 'var(--font-weight-404)',
      },
      borderRadius: {
        sl: 'var(--border-radius-sl)',
      },
      borderColor: {
        list: 'var(--border-list)',
        input: 'var(--border-input)',
        scroll: 'var(--border-scroll)',
        selected: 'var(--border-selected)',
      },
      textColor: {
        default: 'var(--text-color-default)',
        emphasis: 'var(--text-color-emphasis)',
        category: 'var(--text-color-category)',
        blue: 'var(--text-color-blue)',
      },
      colors: {
        main: 'var(--color-main)',
        sub: 'var(--color-sub)',
        close: 'var(--color-close)',
        'contents-box': 'var(--color-contents-box)',
        error: 'var(--color-error)',
        disable: 'var(--color-disable)',
        selected: 'var(--color-selected)',
        scroll: 'var(--color-scroll)',
        button: 'var(--color-button)',
        kakao: 'var(--color-kakao)',
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
  plugins: [require('tailwind-scrollbar-hide')],
};
