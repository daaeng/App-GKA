import { Head } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

// === Ikon SVG Sederhana ===
const Icons = {
    Check: () => (
        <svg className="w-5 h-5 text-yellow-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
    ),
    ArrowRight: () => (
        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
    ),
    Truck: () => (
        <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"></path></svg>
    ),
    Globe: () => (
        <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
    ),
    Shield: () => (
        <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
    )
};

export default function Welcome() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        document.title = 'PT. Garuda Karya Amanat - Profesional & Terpercaya';

        const loadResource = (tag: string, attrs: Record<string, string>) => {
            if (!document.querySelector(`[src="${attrs.src}"]`) && !document.querySelector(`[href="${attrs.href}"]`)) {
                const el = document.createElement(tag);
                Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
                document.head.appendChild(el);
            }
        };

        loadResource('link', { rel: 'stylesheet', href: 'https://unpkg.com/aos@2.3.1/dist/aos.css' });
        loadResource('script', { src: 'https://unpkg.com/aos@2.3.1/dist/aos.js' });
        loadResource('script', { src: 'https://cdn.tailwindcss.com' });

        const initAOS = setInterval(() => {
            if ((window as any).AOS) {
                (window as any).AOS.init({
                    duration: 800,
                    easing: 'ease-out-cubic',
                    once: true,
                    offset: 50
                });
                clearInterval(initAOS);
            }
        }, 100);

        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Beranda', href: '#hero' },
        { name: 'Tentang Kami', href: '#about' },
        { name: 'Layanan', href: '#services' },
        { name: 'Produk', href: '#products' },
        { name: 'Kontak', href: '#contact' },
    ];

    const facilities = [
        { name: 'Small Truck', capacity: '1 Ton', desc: 'Solusi cepat untuk pengiriman skala kecil & akses jalan sempit.', img: '/assets/pickup.jpg' },
        { name: 'Heavy Truck', capacity: '14 Ton', desc: 'Armada tangguh untuk logistik material konstruksi & perkebunan.', img: '/assets/truck.jpeg' },
        { name: 'Container', capacity: '24 Ton', desc: 'Standar ekspor untuk pengiriman skala besar antar pulau.', img: '/assets/pelni.png' }
    ];

    // [UPDATE] Perbaikan Nama & Deskripsi Produk Tengah
    const products = [
        { name: 'Karet Alam Premium', img: '/assets/karet1.jpeg', tag: 'Best Seller' },
        { name: 'Karet Kering Super', img: '/assets/karet2.jpeg', tag: 'High DRC' }, // Update: Kadar Kering
        { name: 'Hasil Perkebunan', img: '/assets/getah.jpeg', tag: 'Organic' }
    ];

    return (
        <div className="font-sans text-slate-800 bg-slate-50 overflow-x-hidden selection:bg-yellow-400 selection:text-black">
            <Head title="Welcome" />

            {/* === NAVBAR === */}
            <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'}`}>
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <img src="/assets/GKA_no_Tag.png" alt="GKA Logo" className="h-10 w-auto drop-shadow-md" />
                        <span className={`font-bold text-xl tracking-wide ${scrolled ? 'text-slate-800' : 'text-white'}`}>
                            GKA<span className="text-yellow-500">.</span>
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className={`text-sm font-medium hover:text-yellow-500 transition-colors ${scrolled ? 'text-slate-600' : 'text-slate-200'}`}
                            >
                                {link.name}
                            </a>
                        ))}
                        <a href="/login" className="bg-yellow-500 hover:bg-yellow-400 text-white hover:text-black px-6 py-2 rounded-full font-bold text-sm transition-all shadow-lg hover:shadow-yellow-500/50">
                            Masuk Area Kerja
                        </a>
                    </div>
                </div>
            </nav>

            {/* === HERO SECTION === */}
            <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="/assets/bghero.jpg" alt="Background" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/30"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10 pt-20">
                    <div className="max-w-3xl" data-aos="fade-up">
                        <div className="inline-block px-3 py-1 mb-4 border border-yellow-500/50 rounded-full bg-yellow-500/10 backdrop-blur-sm">
                            <span className="text-yellow-400 text-xs font-bold tracking-widest uppercase">Perdagangan & Konstruksi</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
                            Membangun <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">Natuna</span>,<br />
                            Menjangkau Dunia.
                        </h1>
                        <p className="text-lg text-slate-300 mb-8 leading-relaxed max-w-xl">
                            PT. Garuda Karya Amanat hadir sebagai mitra strategis dalam sektor perkebunan dan konstruksi. Profesional, Amanah, dan Berintegritas.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a href="#about" className="px-8 py-4 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-all shadow-[0_0_20px_rgba(234,179,8,0.5)] flex items-center justify-center">
                                Jelajahi Layanan <Icons.ArrowRight />
                            </a>
                            <a href="#contact" className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold rounded-lg hover:bg-white hover:text-black transition-all flex items-center justify-center">
                                Hubungi Kami
                            </a>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 w-full bg-white/5 backdrop-blur-md border-t border-white/10 py-6 hidden md:block">
                    <div className="container mx-auto px-6 flex justify-around text-white">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-500/20 rounded-lg"><Icons.Shield /></div>
                            <div><p className="font-bold text-xl">100%</p><p className="text-xs text-slate-400">Amanah</p></div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-500/20 rounded-lg"><Icons.Truck /></div>
                            <div><p className="font-bold text-xl">Cepat</p><p className="text-xs text-slate-400">Distribusi</p></div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-500/20 rounded-lg"><Icons.Globe /></div>
                            <div><p className="font-bold text-xl">Global</p><p className="text-xs text-slate-400">Jaringan</p></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* === ABOUT SECTION === */}
            <section id="about" className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2 relative" data-aos="fade-right">
                            <div className="absolute -top-4 -left-4 w-24 h-24 bg-yellow-100 rounded-full -z-10"></div>
                            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-slate-100 rounded-full -z-10"></div>
                            <img src="/assets/karet.jpeg" alt="Tentang Kami" className="rounded-2xl shadow-2xl w-full object-cover h-[500px]" />
                            <div className="absolute bottom-10 right-[-20px] bg-white p-6 rounded-xl shadow-xl border-l-4 border-yellow-500 hidden md:block">
                                <p className="font-bold text-4xl text-slate-800">5+</p>
                                <p className="text-sm text-slate-500">Tahun Pengalaman</p>
                            </div>
                        </div>
                        <div className="lg:w-1/2" data-aos="fade-left">
                            <h4 className="text-yellow-500 font-bold uppercase tracking-widest text-sm mb-2">Tentang Perusahaan</h4>
                            <h2 className="text-4xl font-bold text-slate-900 mb-6">Mitra Terpercaya di Tanah Natuna</h2>
                            <p className="text-slate-600 mb-6 leading-relaxed text-lg">
                                PT. Garuda Karya Amanat bukan sekadar perusahaan, melainkan jembatan yang menghubungkan potensi alam Natuna dengan pasar global. Kami fokus pada kualitas, efisiensi, dan dampak positif bagi masyarakat.
                            </p>

                            <div className="space-y-4">
                                <div className="flex gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-yellow-400 transition-colors">
                                    <div className="mt-1"><Icons.Check /></div>
                                    <div>
                                        <h5 className="font-bold text-slate-900">Kepuasan Pelanggan</h5>
                                        <p className="text-sm text-slate-500">Prioritas utama kami adalah kepercayaan dan profesionalitas.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-yellow-400 transition-colors">
                                    <div className="mt-1"><Icons.Check /></div>
                                    <div>
                                        <h5 className="font-bold text-slate-900">Kualitas Kompetitif</h5>
                                        <p className="text-sm text-slate-500">Menjaga standar mutu produk perkebunan dan material.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* === SERVICES SECTION === */}
            <section id="services" className="py-24 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16" data-aos="fade-up">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Armada Logistik</h2>
                        <p className="text-slate-500">Kami menyediakan berbagai pilihan armada untuk memastikan barang Anda sampai tepat waktu dan aman.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {facilities.map((item, idx) => (
                            <div key={idx} className="group bg-white rounded-2xl p-2 shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2" data-aos="fade-up" data-aos-delay={idx * 100}>
                                <div className="relative overflow-hidden rounded-xl h-48 mb-4">
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all z-10"></div>
                                    <img src={item.img} alt={item.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="text-xl font-bold text-slate-800">{item.name}</h3>
                                        <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded">{item.capacity}</span>
                                    </div>
                                    <p className="text-slate-500 text-sm leading-relaxed mb-4">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* === PRODUCTS SECTION === */}
            <section id="products" className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                        <div data-aos="fade-right">
                            <h2 className="text-3xl font-bold text-slate-900 mb-2">Produk Unggulan</h2>
                            <p className="text-slate-500">Komoditas terbaik dari bumi Natuna.</p>
                        </div>
                        <a href="#contact" className="text-yellow-600 font-bold hover:text-yellow-700 flex items-center mt-4 md:mt-0" data-aos="fade-left">
                            Lihat Katalog Lengkap <Icons.ArrowRight />
                        </a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {products.map((product, idx) => (
                            <div key={idx} className="group relative overflow-hidden rounded-2xl shadow-lg h-80" data-aos="zoom-in" data-aos-delay={idx * 100}>
                                <img src={product.img} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
                                <div className="absolute top-4 left-4">
                                    <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/30">{product.tag}</span>
                                </div>
                                <div className="absolute bottom-0 left-0 p-6 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                    <h3 className="text-2xl font-bold text-white mb-1">{product.name}</h3>
                                    <div className="h-1 w-12 bg-yellow-500 rounded group-hover:w-24 transition-all duration-300"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* === CTA / CONTACT SECTION === */}
            <section id="contact" className="py-24 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-8 md:p-12 text-center max-w-4xl mx-auto shadow-2xl">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Siap Bekerja Sama?</h2>
                        <p className="text-slate-400 mb-8 text-lg">
                            Hubungi kami untuk penawaran harga terbaik, konsultasi logistik, atau kemitraan jangka panjang. Tim kami siap melayani Anda 24/7.
                        </p>

                        <div className="grid md:grid-cols-3 gap-6 text-left mt-10">
                            {/* Alamat */}
                            <div className="p-4 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition-colors cursor-pointer group">
                                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Kantor Pusat</p>
                                <p className="font-semibold group-hover:text-yellow-400 transition-colors">Jl. Sudirman No 59, Ranai Kota, Natuna</p>
                            </div>

                            {/* Email - Perbaikan Layout untuk Email Panjang */}
                            <a href="mailto:ptgarudakaryaamanat@gmail.com" className="p-4 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition-colors group">
                                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Email Resmi</p>
                                <p className="font-semibold group-hover:text-yellow-400 transition-colors break-all text-sm md:text-base">
                                    ptgarudakaryaamanat@gmail.com
                                </p>
                            </a>

                            {/* WhatsApp */}
                            <a href="https://wa.me/6285788940801" className="p-4 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition-colors group">
                                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">WhatsApp</p>
                                <p className="font-semibold group-hover:text-yellow-400 transition-colors">+62 857 8894 0801</p>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* === FOOTER === */}
            <footer className="bg-black text-slate-500 py-8 border-t border-slate-800">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <img src="/assets/GKA_no_TAG.png" alt="Logo" className="h-8 opacity-70 grayscale hover:grayscale-0 transition-all" />
                        <span className="text-sm font-semibold text-slate-300">PT. Garuda Karya Amanat</span>
                    </div>
                    <p className="text-xs">&copy; {new Date().getFullYear()} Hak Cipta Dilindungi.</p>
                </div>
            </footer>
        </div>
    );
}
