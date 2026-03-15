export default function Footer() {
  return (
    <footer className="fixed bottom-0 w-full py-4 text-center text-sm text-white/70 z-100">
      © {new Date().getFullYear()} ThanhNHM. All rights reserved.
    </footer>
  );
}