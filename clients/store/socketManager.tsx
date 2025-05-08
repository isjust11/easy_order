// clients/components/OrderComponent.tsx
import { useEffect } from 'react';
import { RootState } from '@/store';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { SOCKET_CONNECT, SOCKET_DISCONNECT, socketEmit } from './actions/socketAction';
import SocketStatus from '@/components/SocketStatus';

const RECONNECT_INTERVAL = 5000; // 5 seconds
const MAX_RECONNECT_ATTEMPTS = 5;

const SocketManager = () => {
  const dispatch = useAppDispatch();
  const { isConnected,error, reconnectAttempts, retries } = useAppSelector((state: RootState) => state.socket);
 // Lấy event đang retry gần nhất
 const currentRetry = Object.entries(retries).reduce((latest, [event, data]) => {
  if (!latest || data.lastAttempt > latest.lastAttempt) {
    return { event, ...data };
  }
  return latest;
}, null as null | { event: string; count: number; lastAttempt: number });

  useEffect(() => {
    let reconnectTimer: NodeJS.Timeout;
    let reconnectAttempts = 0;

    const connect = () => {
      console.log('Connecting to socket f');
      dispatch({ type: SOCKET_CONNECT });
    };

    const handleReconnect = () => {
      if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttempts++;
        dispatch({
          type: 'socket/reconnecting',
          payload: { reconnectAttempts }
        });
        reconnectTimer = setTimeout(connect, RECONNECT_INTERVAL);
      } else {
        dispatch({
          type: 'socket/error',
          payload: { error: 'Không thể kết nối đến server sau nhiều lần thử' }
        });
      }
    };

    connect();

    return () => {
      dispatch({ type: SOCKET_DISCONNECT });
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
    };
  }, [dispatch]);

  const sendMessage = (message: any) => {
    dispatch({
      type: 'socket/sendMessage',
      payload: message
    });
  };

  return (
    <div>
     <div className="fixed bottom-4 right-4 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
        <span className="text-sm">
          {isConnected ? 'Đã kết nối' : 'Đang kết nối...'}
        </span>
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
      {reconnectAttempts > 0 && (
        <p className="text-xs text-gray-500 mt-1">
          Đang thử kết nối lại (Lần {reconnectAttempts})
        </p>
      )}

      {currentRetry && (
        <p className="text-xs text-yellow-500 mt-1">
          Đang thử lại sự kiện "{currentRetry.event}" (Lần {currentRetry.count})
        </p>
      )}
    </div>
    </div>
  );
};

export default SocketManager;