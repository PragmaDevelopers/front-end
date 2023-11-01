import './globals.css';
import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import Main from './components/global/Main';

const interFont = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
});
const poppinsFont = Poppins({
    subsets: ['latin'],
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    variable: '--font-poppins',
});


export const metadata: Metadata = {
    title: 'Sistema da Rafael do Canto Advocacia e Socidade',
    description: 'Sistema de gerenciamento',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="pt-br">
            <body className={`${interFont.variable} ${poppinsFont.variable} scrollbar-thin scrollbar-thumb-neutral-100 scrollbar-track-400 font-poppins w-screen h-screen bg-neutral-50 flex flex-col justify-start items-start transition-all text-neutral-950 `}>
                <Main>
                    {children}
                </Main>
            </body>
        </html>
    )
}
