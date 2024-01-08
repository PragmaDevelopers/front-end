"use client"

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <body className="h-[100vh]">
            {children}
        </body>
    )
}