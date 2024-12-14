export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
        className={`h-screen m-32`}
      >
        {children}
    </div>
  );
}
