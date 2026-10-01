import React from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { STUDENT, VARIANT, ROOM_LABEL, examStamp, BASE_SHIP_FEE } from '@constants/student';
import { THEME } from '@constants/theme';
import useAuthStore from '@stores/authStore';
import useCampusLocation, { KTX_GATE_COORDS } from '@hooks/useCampusLocation';
import Watermark from '@components/Watermark';

export const MeScreen: React.FC = () => {
  const { logout, identifier } = useAuthStore();
  const {
    status,
    coords,
    distanceKm,
    shipFee,
    loading,
    errorMsg,
    refresh,
    openSettings,
  } = useCampusLocation();

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất tài khoản?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Đăng xuất', style: 'destructive', onPress: () => logout() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hồ Sơ & Vị Trí</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutBtnText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* Card Thông tin sinh viên */}
        <View style={styles.card}>
          <View style={styles.avatarRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>SV</Text>
            </View>
            <View style={styles.studentInfo}>
              <Text style={styles.studentName}>{STUDENT.hoTen}</Text>
              <Text style={styles.studentMSSV}>MSSV: {STUDENT.mssv}</Text>
              <Text style={styles.studentStamp}>Stamp: #{examStamp()}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>Phòng giao:</Text>
            <Text style={styles.infoValue}>{ROOM_LABEL}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>Tài khoản đăng nhập:</Text>
            <Text style={styles.infoValue}>{identifier || 'Chưa đăng nhập'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>Biến thể đề thi:</Text>
            <Text style={styles.infoValue}>
              VARIANT {VARIANT.shipFormula} (Số cuối: {STUDENT.mssv.slice(-1)})
            </Text>
          </View>
        </View>

        {/* Card Định Vị & Phí Ship (3 nhánh quyền) */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>📍 Định Vị & Phí Giao Hàng</Text>
            {loading && <ActivityIndicator size="small" color={THEME.primary} />}
          </View>

          <Text style={styles.subText}>
            Cổng KTX IUH cố định: {KTX_GATE_COORDS.latitude}, {KTX_GATE_COORDS.longitude}
          </Text>

          <View style={styles.divider} />

          {/* Nhánh 1: Granted */}
          {status === 'granted' || coords ? (
            <View style={styles.statusBoxGranted}>
              <Text style={styles.grantedTitle}>✅ Đã định vị thành công</Text>
              <Text style={styles.locationDetail}>
                Tọa độ hiện tại: {coords?.latitude.toFixed(4)}, {coords?.longitude.toFixed(4)}
              </Text>
              <Text style={styles.locationDetail}>
                Khoảng cách Haversine: <Text style={styles.bold}>{distanceKm ?? 0} km</Text>
              </Text>
              <Text style={styles.locationDetail}>
                Công thức: {VARIANT.shipFormula} ({BASE_SHIP_FEE} + km * 1500 + 2000)
              </Text>
              <View style={styles.feeHighlightBox}>
                <Text style={styles.feeHighlightLabel}>Phí ship tính được:</Text>
                <Text style={styles.feeHighlightValue}>
                  {shipFee ? `${shipFee.toLocaleString('vi-VN')} đ` : 'Đang tính...'}
                </Text>
              </View>

              <TouchableOpacity style={styles.actionBtn} onPress={refresh}>
                <Text style={styles.actionBtnText}>Cập nhật lại vị trí</Text>
              </TouchableOpacity>
            </View>
          ) : status === 'blocked' ? (
            /* Nhánh 2: Blocked -> mở Cài đặt */
            <View style={styles.statusBoxBlocked}>
              <Text style={styles.blockedTitle}>⚠️ Quyền vị trí đã bị chặn</Text>
              <Text style={styles.statusDesc}>
                Bạn đã từ chối quyền với tùy chọn "Không hỏi lại". Hãy mở Cài đặt hệ thống để cấp quyền vị trí cho KTXGo.
              </Text>
              <TouchableOpacity style={styles.settingsBtn} onPress={openSettings}>
                <Text style={styles.settingsBtnText}>Mở Cài đặt hệ thống</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* Nhánh 3: Denied hoặc Chưa cấp quyền */
            <View style={styles.statusBoxDenied}>
              <Text style={styles.deniedTitle}>❌ Chưa cấp quyền vị trí</Text>
              <Text style={styles.statusDesc}>
                {errorMsg || 'KTXGo cần quyền vị trí để ước tính khoảng cách và phí ship tận phòng.'}
              </Text>
              <TouchableOpacity style={styles.actionBtn} onPress={refresh}>
                <Text style={styles.actionBtnText}>Cấp quyền vị trí</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      <Watermark />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: THEME.surface,
    borderBottomWidth: 1,
    borderColor: THEME.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.primary,
  },
  logoutBtn: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutBtnText: {
    color: THEME.error,
    fontWeight: '700',
    fontSize: 13,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    backgroundColor: THEME.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: THEME.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: THEME.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 18,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.text,
  },
  studentMSSV: {
    fontSize: 13,
    color: THEME.textLight,
    marginTop: 2,
  },
  studentStamp: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.secondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: THEME.border,
    marginVertical: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  infoKey: {
    fontSize: 13,
    color: THEME.textLight,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.text,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.text,
  },
  subText: {
    fontSize: 12,
    color: THEME.textLight,
    marginTop: 4,
  },
  statusBoxGranted: {
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  grantedTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.success,
    marginBottom: 6,
  },
  locationDetail: {
    fontSize: 13,
    color: THEME.text,
    marginBottom: 3,
  },
  bold: {
    fontWeight: '700',
  },
  feeHighlightBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  feeHighlightLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.text,
  },
  feeHighlightValue: {
    fontSize: 16,
    fontWeight: '800',
    color: THEME.secondary,
  },
  statusBoxBlocked: {
    backgroundColor: '#FFFBEB',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  blockedTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#D97706',
    marginBottom: 6,
  },
  statusBoxDenied: {
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  deniedTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.error,
    marginBottom: 6,
  },
  statusDesc: {
    fontSize: 13,
    color: THEME.textLight,
    marginBottom: 10,
    lineHeight: 18,
  },
  actionBtn: {
    backgroundColor: THEME.primary,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  settingsBtn: {
    backgroundColor: '#D97706',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  settingsBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});

export default MeScreen;
