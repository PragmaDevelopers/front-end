import '../../globals.css';
import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';

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
            <body className={`w-full h-[100vh]`}>
                {children}
            </body>
        </html>
    )
}