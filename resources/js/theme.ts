import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#90caf9', // ダーク背景で視認性の高いブルー
            light: '#e3f2fd',
            dark: '#42a5f5',
            contrastText: '#0a1929',
        },
        secondary: {
            main: '#ffb74d', // ダーク背景で見やすい注意・警戒オレンジ
            light: '#ffe97d',
            dark: '#c88719',
            contrastText: '#000',
        },
        error: {
            main: '#f44336', // 災害・危険レッド
        },
        warning: {
            main: '#ffa726', // 警戒オレンジ
        },
        info: {
            main: '#29b6f6',
        },
        success: {
            main: '#66bb6a', // 安全・避難完了グリーン
        },
        background: {
            default: '#232323', // 深みのあるダーク背景
            paper: '#2e2e2e',   // カード・ダイアログ用サーフェス色
        },
        text: {
            primary: '#ffffff',
            secondary: 'rgba(255, 255, 255, 0.7)',
        },
    },
    typography: {
        fontFamily: [
            '"Noto Sans JP"',
            '"Roboto"',
            '"Helvetica"',
            '"Arial"',
            'sans-serif',
        ].join(','),
        button: {
            textTransform: 'none', // 英字ボタンの大文字強制を無効化
            fontWeight: 600,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                rounded: {
                    borderRadius: 12,
                },
            },
        },
    },
});

export default theme;
