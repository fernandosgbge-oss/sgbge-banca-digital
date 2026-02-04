export default function DesignSystemPage() {
    return (
        <main className="min-h-screen p-8 bg-sg-white text-sg-blue font-sans">
            <h1 className="text-4xl font-bold mb-8">SGBGE Design System</h1>

            <section className="space-y-8">
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Colors</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 rounded-lg bg-sg-red text-white">
                            <p className="font-bold">sg-red</p>
                            <p>#FF350F</p>
                        </div>
                        <div className="p-4 rounded-lg bg-sg-blue text-white">
                            <p className="font-bold">sg-blue</p>
                            <p>#10218B</p>
                        </div>
                        <div className="p-4 rounded-lg bg-sg-white border border-gray-200">
                            <p className="font-bold">sg-white</p>
                            <p>#FCFBFB</p>
                        </div>
                        <div className="p-4 rounded-lg bg-sg-gray">
                            <p className="font-bold">sg-gray</p>
                            <p>#F3F4F6</p>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold mb-4">Buttons</h2>
                    <div className="flex flex-wrap gap-4">
                        <button className="px-6 py-2 bg-sg-red text-white rounded-md hover:opacity-90 transition-opacity">
                            Primary Action (Red)
                        </button>
                        <button className="px-6 py-2 bg-sg-blue text-white rounded-md hover:opacity-90 transition-opacity">
                            Secondary Action (Blue)
                        </button>
                        <button className="px-6 py-2 border border-sg-blue text-sg-blue rounded-md hover:bg-gray-50 transition-colors">
                            Outline Button
                        </button>
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold mb-4">Cards</h2>
                    <div className="p-6 bg-white rounded-xl shadow-sm border border-sg-gray max-w-sm">
                        <h3 className="text-xl font-bold mb-2 text-sg-blue">Card Title</h3>
                        <p className="text-gray-600 mb-4">
                            This card uses the design system tokens. It has a white background but sits on the sg-white page background.
                        </p>
                        <button className="text-sg-red font-medium hover:underline">
                            Learn more →
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}
