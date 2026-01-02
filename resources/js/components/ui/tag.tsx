import { Clock, CheckCircle2, XCircle } from 'lucide-react';
import React from 'react';

// Tentukan tipe untuk status, mencakup yang lama dan baru
type StatusType = 'pending' | 'approved' | 'rejected' | 'belum ACC' | 'diterima' | 'ditolak' | string;

interface TagProps {
    status: StatusType;
}

// Komponen Tag untuk menampilkan status
const Tag: React.FC<TagProps> = ({ status }) => {
    let text = 'Unknown';
    let colorClasses = 'bg-slate-700 text-slate-300 border-slate-600'; // Default
    let Icon = Clock;

    // Logika untuk status
    switch (status) {
        // Status BARU (dari fitur PPB)
        case 'pending':
            text = 'Pending';
            colorClasses = 'bg-yellow-300 text-yellow-900 border-yellow-300';
            Icon = Clock;
            break;
        case 'approved':
            text = 'Disetujui';
            colorClasses = 'bg-green-300 text-green-900 border-green-300';
            Icon = CheckCircle2;
            break;
        case 'rejected':
            text = 'Ditolak';
            colorClasses = 'bg-red-200 text-red-600 border-red-400';
            Icon = XCircle;
            break;
        
        // Status LAMA (dari file tag.tsx Mas Daeng)
        case 'belum ACC':
            text = 'Process';
            colorClasses = 'bg-yellow-300 text-yellow-900 border-yellow-300'; // Disesuaikan
            Icon = Clock;
            break;
        case 'diterima':
            text = 'Accepted';
            colorClasses = 'bg-green-300 text-green-900 border-green-300'; // Disesuaikan
            Icon = CheckCircle2;
            break;
        case 'ditolak':
            text = 'Rejected';
            colorClasses = 'bg-red-300 text-red-300 border-red-300'; // Disesuaikan
            Icon = XCircle;
            break;

        default:
            text = status; // Tampilkan status apa adanya jika tidak dikenali
            break;
    }

    return (
        <span
            className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full border ${colorClasses}`}
        >
            <Icon className="h-3.5 w-3.5 mr-1" />
            {text}
        </span>
    );
};

export default Tag;