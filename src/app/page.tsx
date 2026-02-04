import Link from "next/link";
import Image from "next/image";
import { PWAInstallButton } from "@/features/pwa/components/PWAInstallButton";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sg-blue to-blue-900 text-white relative overflow-hidden">

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-sg-red opacity-10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>

      <main className="z-10 flex flex-col items-center text-center px-6 max-w-4xl">
        <div className="mb-8">
          <Image
            src="/logo.jpeg"
            alt="SGBGE Logo"
            width={150}
            height={150}
            style={{ objectFit: "contain" }}
            priority
          />
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
          SGBGE
        </h1>

        <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mb-12 font-light leading-relaxed">
          Bienvenido al <span className="font-semibold text-white">Ecosistema Digital</span>.
          Gestión financiera segura, rápida y transparente para Guinea Ecuatorial.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Link
            href="/login"
            className="group relative flex-1 bg-sg-red text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-sg-red/25 hover:scale-105 transition-all duration-200 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="relative flex items-center justify-center gap-2">
              Acceder a Banca Digital <span>→</span>
            </span>
          </Link>

          <Link
            href="/info"
            className="flex-1 bg-white/10 backdrop-blur-sm text-blue-100 font-semibold py-4 px-8 rounded-xl hover:bg-white/20 transition-all border border-white/10 flex items-center justify-center text-center"
          >
            Más Información
          </Link>
        </div>
      </main>

      <footer className="absolute bottom-8 text-blue-300/60 text-sm">
        © 2026 SGBGE Digital. Todos los derechos reservados.
      </footer>
      <PWAInstallButton />
    </div>
  );
}
