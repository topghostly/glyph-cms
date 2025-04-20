export default function PreviewLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <html lang="en" className="bg-white text-black">
    <div>{children}</div>
    // </html>
  );
}
