import StyledComponentsRegistry from "./StyledComponentsRegistry";
import MainLayout from "./MainLayout";

export default function RootLayout({
    // Layouts must accept a children prop.
    // This will be populated with nested layouts or pages
    children,
}) {
    return (
        <html lang="en">
            <head>
                <link rel="stylesheet" href="/global.css" />
            </head>
            <body>
                <StyledComponentsRegistry>
                    <MainLayout>
                        {children}
                    </MainLayout>
                </StyledComponentsRegistry>
            </body>
        </html>
    )
}