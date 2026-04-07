import { AlertCircle, CheckCircle2 } from 'lucide-react'

const Alert = ({ type, message }) => (
    <div className={`p-4 rounded-lg flex items-center gap-3 mb-4 ${type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
        }`}>
        {type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
        <span className="text-sm font-medium">{message}</span>
    </div>
);

export default Alert