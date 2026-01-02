import {
  FaUserTie,
  FaUsers,
  FaBoxOpen,
  FaClipboardList,
  FaFileInvoice,
  FaMoneyBill,
  
} from 'react-icons/fa';

interface StatCardProps {
  icon: React.ElementType;
  title: string;
  value: string;
  subtitle: string;
  gradient: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, subtitle, gradient }) => (
    <div className={`p-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-r ${gradient} text-white`}>
        <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <Icon className="text-blue-500 text-xl" />
            </div>
            <div>
                <h4 className="text-sm font-medium">{title}</h4>
                <p className="text-xl font-semibold">{value}</p>
                <p className="text-xs opacity-90">{subtitle}</p>
            </div>
        </div>
    </div>
);

function Stat_Card(){
    return(
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

            <StatCard
                icon={FaMoneyBill}
                title="Total Penjualan Karet"
                value="Rp 1.2 M"
                subtitle="oleh PT GKA"
                gradient="from-green-400 to-green-600"
            />
            
            <StatCard 
                icon={FaBoxOpen} 
                title="Total Produksi Karet" 
                value="250,000 KG" 
                subtitle="oleh TSA" 
                gradient="from-blue-400 to-blue-600" 
            />
            
            <StatCard 
                icon={FaClipboardList} 
                title="Pengajuan Tertunda" 
                value="18" 
                subtitle="Menunggu Persetujuan" 
                gradient="from-red-400 to-red-600" 
            />
            
            <StatCard 
                icon={FaBoxOpen} 
                title="Total Stok Karet" 
                value="12,000 Unit" 
                subtitle="di Gudang PT GKA" 
                gradient="from-yellow-400 to-yellow-600" 
            />
            
            <StatCard 
                icon={FaUsers} 
                title="Total Penoreh Aktif" 
                value="340" 
                subtitle="Terdaftar" 
                gradient="from-purple-400 to-purple-600" 
            />
            
            <StatCard 
                icon={FaFileInvoice} 
                title="Faktur Belum Dibayar" 
                value="22" subtitle="Faktur" 
                gradient="from-pink-400 to-pink-600" 
            />
            
            <StatCard 
                icon={FaMoneyBill} 
                title="Total Kasbon Pending" 
                value="Rp 56 Jt" 
                subtitle="Menunggu Persetujuan" 
                gradient="from-orange-400 to-orange-600" 
            />
            
            <StatCard 
                icon={FaUserTie} 
                title="Total Peran Pengguna"
                value="7" 
                subtitle="Peran Terdaftar" 
                gradient="from-indigo-400 to-indigo-600" 
            />

        </div>
    );

}

export default Stat_Card;