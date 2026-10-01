import { trigger } from 'react-native-haptic-feedback';
import { VARIANT } from '@constants/student';

// So cuoi 1 -> 'selection'. So cuoi chia het cho 3 -> 'impact'.
export function triggerAddHaptic() {
  trigger(VARIANT.hapticOnAdd === 'impact' ? 'impactMedium' : 'selection', {
    enableVibrateFallback: true,
  });
}
