import {
    LayoutDashboard,
    PackageSearch,
    LogOut,
    TrendingUp
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/use-auth';

export default function Layout({ children }) {
    const location = useLocation();
    const { logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
                <div className="p-6 flex items-center gap-3 border-bottom border-slate-100">
                    <div className="bg-blue-600 p-2 rounded-lg">
                        <PackageSearch className="text-white" size={24} />
                    </div>
                    <span className="font-bold text-lg tracking-tight">SalesPredict</span>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link
                        to={'/dashboard'}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${location.pathname === '/dashboard' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-500 hover:bg-slate-50'
                            }`}
                    >
                        <LayoutDashboard size={20} />
                        Dashboard
                    </Link>
                    <Link
                        to={'/predict'}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${location.pathname === '/predict' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-500 hover:bg-slate-50'
                            }`}
                    >
                        <TrendingUp size={20} />
                        Prediksi Produk
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all font-medium"
                    >
                        <LogOut size={20} />
                        Keluar
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">
                            Dashboard
                        </h2>
                        <p className="text-slate-500">Selamat datang kembali, Admin</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="font-bold text-sm">Admin Toko</p>
                            <p className="text-xs text-slate-500">Terakhir login: Hari ini</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                            A
                        </div>
                    </div>
                </header>

                {children}
            </main>
        </div>
    )
}