import Link from "next/link";

export default function InfoPage() {
    return (
        <div className="min-h-screen bg-white text-gray-800 font-sans">
            {/* Header */}
            <div className="bg-sg-blue text-white py-16 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-10 -mt-10"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-sg-red opacity-10 rounded-full -ml-20 -mb-20 blur-3xl"></div>

                <div className="max-w-4xl mx-auto relative z-10">
                    <Link href="/" className="inline-block mb-6 text-blue-200 hover:text-white transition-colors">
                        ← Volver al Inicio
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                        Bienvenido a la Nueva Era de la Banca Digital SGBGE
                    </h1>
                    <p className="text-xl text-blue-100 max-w-2xl leading-relaxed">
                        Una plataforma diseñada para funcionar al ritmo de tu vida en Guinea Ecuatorial.
                    </p>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-6 py-12 space-y-16">
                {/* Intro */}
                <section className="prose lg:prose-xl text-gray-600">
                    <p className="lead">
                        En Société Générale de Banques en Guinée Equatoriale (SGBGE), entendemos que tu tiempo es el activo más valioso. Por eso, hemos transformado nuestra experiencia digital para ofrecerte una plataforma bancaria segura, robusta y eficiente.
                    </p>
                    <p>
                        Olvídate de las colas y las gestiones presenciales. Presentamos nuestro nuevo <strong>Ecosistema Digital</strong>, una aplicación web progresiva (PWA) que pone el control financiero total en la palma de tu mano.
                    </p>
                </section>

                {/* Tech Innovation */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-3xl">🚀</span>
                        <h2 className="text-3xl font-bold text-sg-blue">Innovación Tecnológica</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                            <h3 className="font-bold text-xl mb-3 text-gray-900">Sin Descargas Pesadas</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                No necesitas ocupar espacio en tu teléfono. Nuestra plataforma se actualiza automáticamente sin pasar por tiendas de aplicaciones.
                            </p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                            <h3 className="font-bold text-xl mb-3 text-gray-900">Instalación Directa</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Añade SGBGE a tu pantalla de inicio con un solo clic y úsala como una aplicación nativa.
                            </p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                            <h3 className="font-bold text-xl mb-3 text-gray-900">Modo "Offline-First"</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Tecnología inteligente que te permite consultar tu último saldo y movimientos incluso con conexión inestable.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <span className="text-3xl">💡</span>
                        <h2 className="text-3xl font-bold text-sg-blue">Funcionalidades Principales</h2>
                    </div>

                    <div className="space-y-12">
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="bg-blue-50 p-4 rounded-xl text-sg-blue text-2xl font-bold w-12 h-12 flex items-center justify-center shrink-0">1</div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Gestión de Cuentas y Transferencias</h3>
                                <p className="text-gray-600 mb-4">Visualiza tu posición global con una interfaz limpia diseñada con nuestros colores corporativos.</p>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3">
                                        <span className="text-green-500 mt-1">✓</span>
                                        <span className="text-gray-700"><strong>Saldos en tiempo real:</strong> Consulta tus cuentas al instante.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-green-500 mt-1">✓</span>
                                        <span className="text-gray-700"><strong>Privacidad:</strong> Oculta tus saldos con un toque en lugares públicos.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-green-500 mt-1">✓</span>
                                        <span className="text-gray-700"><strong>Transferencias:</strong> Envíos internos, nacionales (BANGE, CCEI) e internacionales (SWIFT).</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="bg-blue-50 p-4 rounded-xl text-sg-blue text-2xl font-bold w-12 h-12 flex items-center justify-center shrink-0">2</div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Centro de Servicios: Adiós a las Colas</h3>
                                <p className="text-gray-600 mb-4">Pagos de servicios esenciales integrados directamente.</p>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="border border-gray-200 p-4 rounded-xl">
                                        <h4 className="font-bold text-sg-blue mb-2">Electricidad (SEGESA)</h4>
                                        <p className="text-sm text-gray-600">Consulta deuda por contador y paga generando Recibo Digital Oficial.</p>
                                    </div>
                                    <div className="border border-gray-200 p-4 rounded-xl">
                                        <h4 className="font-bold text-sg-blue mb-2">Televisión (Canal+)</h4>
                                        <p className="text-sm text-gray-600">Renueva suscripción o cambia de paquete desde tu sofá.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="bg-blue-50 p-4 rounded-xl text-sg-blue text-2xl font-bold w-12 h-12 flex items-center justify-center shrink-0">3</div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Inversiones BVMAC</h3>
                                <p className="text-gray-600 mb-4">Democratizamos el acceso al mercado de valores de la CEMAC.</p>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3">
                                        <span className="text-sg-blue mt-1">📈</span>
                                        <span className="text-gray-700">Cotizaciones actualizadas (BANGE, SOCAPALM, Bonos).</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-sg-blue mt-1">🧮</span>
                                        <span className="text-gray-700">Simulador de rentabilidad y beneficios fiscales.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Security */}
                <section className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-sg-blue opacity-20 rounded-full blur-3xl -mr-16 -mt-16"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-3xl">🔒</span>
                            <h2 className="text-2xl md:text-3xl font-bold">Seguridad de Grado Militar</h2>
                        </div>
                        <p className="text-blue-200 mb-8 max-w-2xl">
                            Compliance by Design. Cumplimos estrictamente con las normativas de la COBAC (R-2024/01).
                        </p>

                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-white/10 backdrop-blur-sm p-5 rounded-xl border border-white/5">
                                <h3 className="font-bold text-lg mb-2">Biometría</h3>
                                <p className="text-sm text-blue-100/80">Acceso seguro vía Huella o FaceID (WebAuthn).</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm p-5 rounded-xl border border-white/5">
                                <h3 className="font-bold text-lg mb-2">Transparencia</h3>
                                <p className="text-sm text-blue-100/80">Desglose claro de importes, comisiones e impuestos antes de confirmar.</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm p-5 rounded-xl border border-white/5">
                                <h3 className="font-bold text-lg mb-2">Sesiones Seguras</h3>
                                <p className="text-sm text-blue-100/80">Cierre automático por inactividad.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="text-center py-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">¿Listo para empezar?</h2>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Accede ahora, instala la aplicación y descubre por qué SGBGE sigue siendo el referente bancario en Guinea Ecuatorial.
                    </p>
                    <div className="inline-block">
                        <Link
                            href="/login"
                            className="bg-sg-red text-white font-bold py-4 px-12 rounded-xl shadow-lg hover:shadow-sg-red/25 hover:scale-105 transition-all duration-200 block"
                        >
                            Acceder a Banca Digital
                        </Link>
                    </div>
                    <p className="mt-8 text-sg-blue font-bold tracking-widest uppercase text-sm">
                        SGBGE: El futuro es vosotros.
                    </p>
                </section>
            </main>
        </div>
    );
}
