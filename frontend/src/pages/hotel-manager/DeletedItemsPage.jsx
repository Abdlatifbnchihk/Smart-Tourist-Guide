import { useState, useEffect } from 'react'
import {
  getTrashedHotels,
  restoreHotel,
  forceDeleteHotel,
  getTrashedRooms,
  restoreRoom,
  forceDeleteRoom,
} from '../../services/hotelManagerService'
import Skeleton from '../../components/ui/Skeleton'

export default function DeletedItemsPage() {
  const [activeTab, setActiveTab] = useState('hotels')
  const [hotels, setHotels] = useState([])
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmAction, setConfirmAction] = useState(null)
  const [confirmItem, setConfirmItem] = useState(null)
  const [confirmType, setConfirmType] = useState('')
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      if (activeTab === 'hotels') {
        const res = await getTrashedHotels()
        setHotels(res.data || [])
      } else {
        const res = await getTrashedRooms()
        setRooms(res.data || [])
      }
    } catch (err) {
      setError('Failed to load deleted items.')
    } finally {
      setLoading(false)
    }
  }

  const openConfirm = (item, type) => {
    setConfirmItem(item)
    setConfirmType(type)
    setShowConfirmModal(true)
  }

  const handleConfirm = async () => {
    setProcessing(true)
    try {
      if (activeTab === 'hotels') {
        const id = confirmItem.hotel_id || confirmItem.id
        if (confirmType === 'restore') {
          await restoreHotel(id)
          setHotels(hotels.filter((h) => (h.hotel_id || h.id) !== id))
        } else {
          await forceDeleteHotel(id)
          setHotels(hotels.filter((h) => (h.hotel_id || h.id) !== id))
        }
      } else {
        const id = confirmItem.room_id || confirmItem.id
        if (confirmType === 'restore') {
          await restoreRoom(id)
          setRooms(rooms.filter((r) => (r.room_id || r.id) !== id))
        } else {
          await forceDeleteRoom(id)
          setRooms(rooms.filter((r) => (r.room_id || r.id) !== id))
        }
      }
      setShowConfirmModal(false)
      setConfirmItem(null)
      setConfirmType('')
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed.')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Deleted Items</h1>
        <p className="text-gray-600 mt-1">Restore or permanently delete items</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('hotels')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'hotels'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Deleted Hotels ({hotels.length})
        </button>
        <button
          onClick={() => setActiveTab('rooms')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'rooms'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Deleted Rooms ({rooms.length})
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : activeTab === 'hotels' ? (
        hotels.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No deleted hotels</p>
          </div>
        ) : (
          <div className="space-y-4">
            {hotels.map((hotel) => (
              <div
                key={hotel.hotel_id || hotel.id}
                className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between"
              >
                <div>
                  <h3 className="font-semibold text-gray-900">{hotel.name}</h3>
                  <p className="text-sm text-gray-600">{hotel.address}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Deleted: {new Date(hotel.deleted_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openConfirm(hotel, 'restore')}
                    className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                  >
                    Restore
                  </button>
                  <button
                    onClick={() => openConfirm(hotel, 'force-delete')}
                    className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                  >
                    Delete Forever
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : rooms.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No deleted rooms</p>
        </div>
      ) : (
        <div className="space-y-4">
          {rooms.map((room) => (
            <div
              key={room.room_id || room.id}
              className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between"
            >
              <div>
                <h3 className="font-semibold text-gray-900">
                  Room {room.number} - {room.type}
                </h3>
                <p className="text-sm text-gray-600">
                  {room.hotel?.name} | ${room.price_per_night}/night
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Deleted: {new Date(room.deleted_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openConfirm(room, 'restore')}
                  className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                >
                  Restore
                </button>
                <button
                  onClick={() => openConfirm(room, 'force-delete')}
                  className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                >
                  Delete Forever
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {confirmType === 'restore' ? 'Restore Item' : 'Delete Permanently'}
            </h3>
            <p className="text-gray-600 mb-6">
              {confirmType === 'restore'
                ? `Are you sure you want to restore "${confirmItem.name || confirmItem.number}"?`
                : `Are you sure you want to permanently delete "${confirmItem.name || confirmItem.number}"? This action cannot be undone.`}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowConfirmModal(false)
                  setConfirmItem(null)
                  setConfirmType('')
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={processing}
                className={`px-4 py-2 text-white rounded-lg ${
                  confirmType === 'restore'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                } disabled:opacity-50`}
              >
                {processing ? 'Processing...' : confirmType === 'restore' ? 'Restore' : 'Delete Forever'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
