import { PackageSearch } from "lucide-react";
import Layout from "../layouts/layout";
import { useState } from "react";
import axios from "axios";

export default function Predict() {

    const [predictionInput, setPredictionInput] = useState({
        jumlah_penjualan: '',
        harga: '',
        diskon: ''
    });
    const [predictionResult, setPredictionResult] = useState(null);

    const handlePredict = async (e) => {
        e.preventDefault()
        const token = localStorage.getItem("token")
        const data = {
            jumlah_penjualan: parseInt(predictionInput.jumlah_penjualan),
            harga: parseInt(predictionInput.harga),
            diskon: parseInt(predictionInput.diskon)
        }
        const response = await axios.post('/api/predict', data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        setPredictionResult(response.data)
    }

    return (
        <Layout>
            <div className="max-w-2xl bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <PackageSearch className="text-blue-600" />
                    Input Parameter Produk
                </h3>

                <form onSubmit={handlePredict} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Jumlah Penjualan (Unit)</label>
                            <input
                                type="number"
                                placeholder="Contoh: 150"
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                value={predictionInput.jumlah_penjualan}
                                onChange={(e) => setPredictionInput({ ...predictionInput, jumlah_penjualan: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Diskon (%)</label>
                            <input
                                type="number"
                                placeholder="Contoh: 10"
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                value={predictionInput.diskon}
                                onChange={(e) => setPredictionInput({ ...predictionInput, diskon: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Harga Satuan (IDR)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">Rp</span>
                            <input
                                type="number"
                                placeholder="Contoh: 50000"
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                value={predictionInput.harga}
                                onChange={(e) => setPredictionInput({ ...predictionInput, harga: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                        Mulai Analisis Prediksi
                    </button>
                </form>

                {predictionResult && true && (
                    <div className={`mt-8 p-6 rounded-2xl flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500 ${predictionResult === 'Laris' ? 'bg-emerald-50 border border-emerald-100' : 'bg-red-50 border border-red-100'
                        }`}>
                        <p className="text-sm font-medium uppercase tracking-wider mb-2 text-slate-500">Hasil Prediksi Status</p>
                        <div className={`text-4xl font-black mb-2 ${predictionResult.prediksi_status === 'Laris' ? 'text-emerald-600' : 'text-red-600'
                            }`}>
                            {predictionResult.prediksi_status.toUpperCase()}
                        </div>
                        <p className="text-slate-600 text-sm max-w-xs">
                            Berdasarkan parameter yang dimasukkan, produk ini diprediksi memiliki performa penjualan yang {predictionResult.prediksi_status === 'Laris' ? 'sangat baik' : 'kurang optimal'}.
                        </p>
                    </div>
                )}
            </div>
        </Layout>
    )
}