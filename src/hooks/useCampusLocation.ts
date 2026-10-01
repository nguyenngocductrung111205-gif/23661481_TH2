import { useCallback, useEffect, useState } from 'react';
import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { BASE_SHIP_FEE, VARIANT } from '@constants/student';

// Tọa độ Cổng KTX IUH (Số 12 Nguyễn Văn Bảo, Gò Vấp, TP.HCM)
export const KTX_GATE_COORDS = {
  latitude: 10.8222,
  longitude: 106.6875,
};

export type PermissionStatus = 'idle' | 'granted' | 'denied' | 'blocked';

export interface Coords {
  latitude: number;
  longitude: number;
}

export function haversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

export function calculateShippingFee(distanceKm: number): number {
  if (VARIANT.shipFormula === 'A') {
    return BASE_SHIP_FEE + Math.round(distanceKm * 2000);
  } else {
    // Formula B
    return BASE_SHIP_FEE + Math.round(distanceKm * 1500) + 2000;
  }
}

export const useCampusLocation = () => {
  const [status, setStatus] = useState<PermissionStatus>('idle');
  const [coords, setCoords] = useState<Coords | null>(null);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [shipFee, setShipFee] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (Platform.OS === 'ios') {
      try {
        Geolocation.requestAuthorization();
        setStatus('granted');
        return true;
      } catch (e) {
        setStatus('denied');
        return false;
      }
    }

    try {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'KTXGo cần quyền vị trí',
          message: 'Cho phép KTXGo xác định vị trí để tính phí giao đồ đến phòng của bạn.',
          buttonPositive: 'Cho phép',
          buttonNegative: 'Để sau',
        }
      );

      if (result === PermissionsAndroid.RESULTS.GRANTED) {
        setStatus('granted');
        return true;
      } else if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        setStatus('blocked');
        Alert.alert(
          'Quyền vị trí bị chặn',
          'Bạn đã chặn quyền vị trí. Vui lòng vào Cài đặt để cấp quyền cho KTXGo.',
          [
            { text: 'Hủy', style: 'cancel' },
            { text: 'Mở Cài đặt', onPress: () => Linking.openSettings() },
          ]
        );
        return false;
      } else {
        setStatus('denied');
        return false;
      }
    } catch (err) {
      setStatus('denied');
      return false;
    }
  }, []);

  const getCurrentLocation = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);

    const isGranted = await requestPermission();
    if (!isGranted) {
      setLoading(false);
      setErrorMsg('Chưa được cấp quyền truy cập vị trí');
      return;
    }

    Geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;
        setCoords({ latitude: userLat, longitude: userLon });

        const dist = haversineDistanceKm(
          userLat,
          userLon,
          KTX_GATE_COORDS.latitude,
          KTX_GATE_COORDS.longitude
        );
        setDistanceKm(dist);

        const fee = calculateShippingFee(dist);
        setShipFee(fee);

        setLoading(false);
      },
      (error) => {
        // Fallback for emulator if GPS has no signal
        const fallbackLat = 10.8245;
        const fallbackLon = 106.6890;
        setCoords({ latitude: fallbackLat, longitude: fallbackLon });
        const dist = haversineDistanceKm(
          fallbackLat,
          fallbackLon,
          KTX_GATE_COORDS.latitude,
          KTX_GATE_COORDS.longitude
        );
        setDistanceKm(dist);
        setShipFee(calculateShippingFee(dist));
        setLoading(false);
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 }
    );
  }, [requestPermission]);

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  return {
    status,
    coords,
    distanceKm,
    shipFee,
    loading,
    errorMsg,
    requestPermission,
    refresh: getCurrentLocation,
    openSettings: () => Linking.openSettings(),
  };
};

export default useCampusLocation;
