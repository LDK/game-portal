/** @type {import('postcss-load-config').Config} */

import tailwindcss from 'tailwindcss';
import nesting from 'postcss-nesting';

const config = {
  plugins: {
    tailwindcss,
    nesting,
  },
};

export default config;
