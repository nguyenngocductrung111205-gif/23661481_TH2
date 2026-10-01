import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { STUDENT, VARIANT, ROOM_LABEL } from '@constants/student';
import { THEME } from '@constants/theme';
import { useAuthStore } from '@stores/authStore';
import Watermark from '@components/Watermark';

export const LoginScreen: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const login = useAuthStore((state) => state.login);

  const isPhone = VARIANT.authField === 'phone';
  const labelText = isPhone ? 'Số điện thoại sinh viên' : 'Email sinh viên';
  const placeholderText = isPhone
    ? 'Nhập số điện thoại (VD: 0987654321)...'
    : 'Nhập email sinh viên (VD: sv@iuh.edu.vn)...';

  const handleLogin = () => {
    if (!inputValue.trim()) {
      Alert.alert(
        'Thông báo',
        `Vui lòng nhập ${isPhone ? 'số điện thoại' : 'email'} để tiếp tục!`
      );
      return;
    }

    login(inputValue.trim());
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          <View style={styles.headerBox}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoIcon}>📦</Text>
            </View>
            <Text style={styles.appTitle}>KTXGo</Text>
            <Text style={styles.appSubtitle}>
              Dịch vụ giao đồ tận phòng · {ROOM_LABEL}
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.inputLabel}>{labelText}</Text>
            <TextInput
              style={styles.input}
              placeholder={placeholderText}
              placeholderTextColor={THEME.textLight}
              value={inputValue}
              onChangeText={setInputValue}
              keyboardType={isPhone ? 'phone-pad' : 'email-address'}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity
              style={styles.loginButton}
              activeOpacity={0.8}
              onPress={handleLogin}
            >
              <Text style={styles.loginButtonText}>Vào cửa hàng</Text>
            </TouchableOpacity>

            <Text style={styles.noteText}>
              MSSV: {STUDENT.mssv} · Định danh: {isPhone ? 'Phone Auth' : 'Email Auth'}
            </Text>
          </View>
        </View>

        <Watermark />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  headerBox: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logoIcon: {
    fontSize: 32,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: THEME.primary,
    letterSpacing: 0.5,
  },
  appSubtitle: {
    fontSize: 14,
    color: THEME.textLight,
    marginTop: 4,
    fontWeight: '500',
  },
  card: {
    backgroundColor: THEME.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: THEME.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.text,
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: THEME.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    color: THEME.text,
    backgroundColor: '#F8FAFC',
    marginBottom: 18,
  },
  loginButton: {
    height: 48,
    backgroundColor: THEME.primary,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  noteText: {
    textAlign: 'center',
    fontSize: 12,
    color: THEME.textLight,
    marginTop: 14,
  },
});

export default LoginScreen;
