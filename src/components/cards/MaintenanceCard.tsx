import Link from 'next/link'

interface MaintenanceCardProps {
  title: string
  duration: string
  type: string
  id: string
}

export default function MaintenanceCard({ title, duration, type, id }: MaintenanceCardProps) {
  return (
    <Link href={`/play/${type}/${id}`}>
      <div className="flex w-[162px] p-3 flex-col items-start gap-4 rounded-lg bg-[#23262A] shadow-[0px_2px_7px_0px_rgba(0,0,0,0.25)]">
        <div className="w-12 h-12 rounded-lg bg-[#1A1D20] flex items-center justify-center">
          <svg width="45" height="44" viewBox="0 0 45 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.397949" width="44" height="44" rx="5" fill="#1A1D20"/>
            <path d="M22.3979 12C16.8836 12 12.3979 16.4861 12.3979 22C12.3979 27.5139 16.8836 32 22.3979 32C27.9123 32 32.3979 27.5139 32.3979 22C32.3979 16.4861 27.9123 12 22.3979 12ZM26.3734 22.3504L20.5401 26.1004C20.4717 26.1447 20.3928 26.1667 20.3146 26.1667C20.2463 26.1667 20.1771 26.1496 20.1153 26.1158C19.981 26.0426 19.8979 25.9026 19.8979 25.75V18.25C19.8979 18.0974 19.981 17.9574 20.1153 17.8842C20.2471 17.8118 20.4123 17.8162 20.5401 17.8996L26.3734 21.6496C26.4922 21.7261 26.5646 21.8584 26.5646 22C26.5646 22.1416 26.4922 22.2738 26.3734 22.3504Z" fill="#2B6D79"/>
          </svg>
        </div>
        <div className="space-y-1">
          <h3 className="text-white font-medium">{title}</h3>
          <p className="text-gray-400 text-sm font-light">{duration}</p>
        </div>
      </div>
    </Link>
  )
} 