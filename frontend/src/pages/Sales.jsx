import { useEffect, useState } from "react";
import Layout from "../layouts/layout";
import {
    TrendingDown,
    TrendingUp
} from 'lucide-react'
import axios from "axios";

export default function Sales() {
    const [salesData, setSalesData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {

        const fetchSales = async () => {
            try {
                const token = localStorage.getItem("token")
                
                const res = await axios.get('/api/sales', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setSalesData(res.data.data);
            } catch (err) {
                if (axios.isCancel(err)) {
                    console.log("Request dibatalkan");
                } else {
                    setError(err.message);
                }
            }
        };

        fetchSales();
    }, []);

    return (
        <Layout>
            <div className="space-y-6">
                {/* Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800">Daftar Data Produk</h3>
                        {/* <button className="text-sm text-blue-600 font-semibold hover:underline">Lihat Semua</button> */}
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                                <tr>
                                    <th className="px-6 py-4">ID / Nama Produk</th>
                                    <th className="px-6 py-4 text-center">Penjualan</th>
                                    <th className="px-6 py-4">Harga Satuan</th>
                                    <th className="px-6 py-4">Diskon</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {salesData.length > 0 ? salesData.map((item) => (
                                    <tr key={item.product_id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-slate-800">{item.product_name}</p>
                                            <p className="text-xs text-slate-400">{item.product_id}</p>
                                        </td>
                                        <td className="px-6 py-4 text-center font-medium">{item.jumlah_penjualan}</td>
                                        <td className="px-6 py-4 font-medium">Rp {item.harga.toLocaleString('id-ID')}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-bold">
                                                {item.diskon}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold w-fit ${item.status === 'Laris'
                                                ? 'bg-emerald-50 text-emerald-600'
                                                : 'bg-red-50 text-red-600'
                                                }`}>
                                                {item.status.toLowerCase() === 'laris' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="text-center py-4 opacity-50">No data</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    )
}