module.exports = {
	content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				primaryDark: 'var(--primaryDark)',
				secondaryDark: 'var(--secondaryDark)',
				accentDark: 'var(--accentDark)',
				accentSecondaryDark: 'var(--accentSecondaryDark)',
				backgroundDark: 'var(--backgroundDark)',
				primaryLight: 'var(--primaryLight)',
				secondaryLight: 'var(--secondaryLight)',
				accentSecondaryLight: 'var(--accentSecondaryLight)',
				backgroundLight: 'var(--backgroundLight)',
			},
		},
	},
	plugins: [],
};
