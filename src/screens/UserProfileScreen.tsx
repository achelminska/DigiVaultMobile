import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Alert,
} from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { useUserProfile, useUpdateName, useUpdateEmail, useUpdatePassword } from '../hooks/useUserProfile';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { UserProfileScreenProps } from '../types/navigation';
import { colors } from '../config/theme';

type EditSection = 'name' | 'email' | 'password' | null;

export default function UserProfileScreen({ navigation }: UserProfileScreenProps) {
  const { data: profile, isLoading, isError, refetch } = useUserProfile();
  const { idUser } = useCurrentUser();

  const updateName = useUpdateName();
  const updateEmail = useUpdateEmail();
  const updatePassword = useUpdatePassword();

  const [editing, setEditing] = useState<EditSection>(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [email, setEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName);
      setLastName(profile.lastName);
      setEmail(profile.email);
    }
  }, [profile]);

  const openSection = (section: EditSection) => {
    setEditing(section);
    setEmailPassword('');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const cancelEdit = () => setEditing(null);

  const handleSaveName = () => {
    if (!idUser) return;
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Błąd', 'Imię i nazwisko nie mogą być puste.');
      return;
    }
    updateName.mutate(
      { idUser, firstName: firstName.trim(), lastName: lastName.trim() },
      {
        onSuccess: () => setEditing(null),
        onError: () => Alert.alert('Błąd', 'Nie udało się zaktualizować imienia i nazwiska.'),
      },
    );
  };

  const handleSaveEmail = () => {
    if (!idUser) return;
    if (!email.trim() || !emailPassword) {
      Alert.alert('Błąd', 'Wypełnij wszystkie pola.');
      return;
    }
    updateEmail.mutate(
      { idUser, email: email.trim(), password: emailPassword },
      {
        onSuccess: () => setEditing(null),
        onError: () => Alert.alert('Błąd', 'Nie udało się zaktualizować e-maila. Sprawdź hasło.'),
      },
    );
  };

  const handleSavePassword = () => {
    if (!idUser) return;
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Błąd', 'Wypełnij wszystkie pola.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Błąd', 'Nowe hasła nie są zgodne.');
      return;
    }
    updatePassword.mutate(
      {
        idUser,
        password: currentPassword,
        newPassword,
        newPasswordConfirmation: confirmPassword,
      },
      {
        onSuccess: () => {
          setEditing(null);
          Alert.alert('Sukces', 'Hasło zostało zmienione.');
        },
        onError: () => Alert.alert('Błąd', 'Nie udało się zmienić hasła. Sprawdź aktualne hasło.'),
      },
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <AntDesignIcon name="arrowleft" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Dane konta</Text>
        <View style={styles.backBtn} />
      </View>

      {isLoading && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.textPrimary} />
        </View>
      )}

      {isError && (
        <View style={styles.centered}>
          <AntDesignIcon name="exclamationcircleo" size={48} color={colors.textFaint} />
          <Text style={styles.errorText}>Nie udało się pobrać danych</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
            <Text style={styles.retryText}>Spróbuj ponownie</Text>
          </TouchableOpacity>
        </View>
      )}

      {profile && (
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          {/* ── IMIĘ I NAZWISKO ── */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>Imię i nazwisko</Text>
            {editing !== 'name' && (
              <TouchableOpacity onPress={() => openSection('name')} style={styles.editBtn}>
                <AntDesignIcon name="edit" size={15} color={colors.textSecondary} />
                <Text style={styles.editBtnText}>Edytuj</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.card}>
            {editing === 'name' ? (
              <View style={styles.formPad}>
                <Text style={styles.inputLabel}>Imię</Text>
                <TextInput
                  style={styles.input}
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="Imię"
                  placeholderTextColor={colors.textFaint}
                />
                <Text style={styles.inputLabel}>Nazwisko</Text>
                <TextInput
                  style={styles.input}
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Nazwisko"
                  placeholderTextColor={colors.textFaint}
                />
                <View style={styles.formBtns}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={cancelEdit}>
                    <Text style={styles.cancelBtnText}>Anuluj</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.saveBtn, updateName.isPending && styles.saveBtnDisabled]}
                    onPress={handleSaveName}
                    disabled={updateName.isPending}>
                    {updateName.isPending
                      ? <ActivityIndicator size="small" color={colors.black} />
                      : <Text style={styles.saveBtnText}>Zapisz</Text>}
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Imię</Text>
                  <Text style={styles.infoValue}>{profile.firstName}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Nazwisko</Text>
                  <Text style={styles.infoValue}>{profile.lastName}</Text>
                </View>
              </>
            )}
          </View>

          {/* ── E-MAIL ── */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>E-mail</Text>
            {editing !== 'email' && (
              <TouchableOpacity onPress={() => openSection('email')} style={styles.editBtn}>
                <AntDesignIcon name="edit" size={15} color={colors.textSecondary} />
                <Text style={styles.editBtnText}>Edytuj</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.card}>
            {editing === 'email' ? (
              <View style={styles.formPad}>
                <Text style={styles.inputLabel}>Nowy e-mail</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="E-mail"
                  placeholderTextColor={colors.textFaint}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <Text style={styles.inputLabel}>Aktualne hasło</Text>
                <TextInput
                  style={styles.input}
                  value={emailPassword}
                  onChangeText={setEmailPassword}
                  placeholder="Hasło"
                  placeholderTextColor={colors.textFaint}
                  secureTextEntry
                />
                <View style={styles.formBtns}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={cancelEdit}>
                    <Text style={styles.cancelBtnText}>Anuluj</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.saveBtn, updateEmail.isPending && styles.saveBtnDisabled]}
                    onPress={handleSaveEmail}
                    disabled={updateEmail.isPending}>
                    {updateEmail.isPending
                      ? <ActivityIndicator size="small" color={colors.black} />
                      : <Text style={styles.saveBtnText}>Zapisz</Text>}
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>E-mail</Text>
                <Text style={styles.infoValue}>{profile.email}</Text>
              </View>
            )}
          </View>

          {/* ── HASŁO ── */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>Hasło</Text>
            {editing !== 'password' && (
              <TouchableOpacity onPress={() => openSection('password')} style={styles.editBtn}>
                <AntDesignIcon name="edit" size={15} color={colors.textSecondary} />
                <Text style={styles.editBtnText}>Zmień</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.card}>
            {editing === 'password' ? (
              <View style={styles.formPad}>
                <Text style={styles.inputLabel}>Aktualne hasło</Text>
                <TextInput
                  style={styles.input}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Aktualne hasło"
                  placeholderTextColor={colors.textFaint}
                  secureTextEntry
                />
                <Text style={styles.inputLabel}>Nowe hasło</Text>
                <TextInput
                  style={styles.input}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Nowe hasło"
                  placeholderTextColor={colors.textFaint}
                  secureTextEntry
                />
                <Text style={styles.inputLabel}>Powtórz nowe hasło</Text>
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Powtórz nowe hasło"
                  placeholderTextColor={colors.textFaint}
                  secureTextEntry
                />
                <View style={styles.formBtns}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={cancelEdit}>
                    <Text style={styles.cancelBtnText}>Anuluj</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.saveBtn, updatePassword.isPending && styles.saveBtnDisabled]}
                    onPress={handleSavePassword}
                    disabled={updatePassword.isPending}>
                    {updatePassword.isPending
                      ? <ActivityIndicator size="small" color={colors.black} />
                      : <Text style={styles.saveBtnText}>Zapisz</Text>}
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Hasło</Text>
                <Text style={styles.infoValue}>••••••••</Text>
              </View>
            )}
          </View>

          {/* ── FINANSE (read-only) ── */}
          <Text style={[styles.sectionLabel, styles.sectionLabelStandalone]}>Finanse</Text>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Saldo</Text>
              <Text style={styles.infoValue}>{profile.balance.toFixed(2)} zł</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Wypłacono łącznie</Text>
              <Text style={styles.infoValue}>{profile.totalWithdrawn.toFixed(2)} zł</Text>
            </View>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 40,
  },
  errorText: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
  retryBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
  },
  retryText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 8,
  },
  sectionLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  sectionLabelStandalone: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 8,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  editBtnText: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  card: {
    marginHorizontal: 20,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  infoLabel: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  infoValue: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
    maxWidth: '55%',
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  formPad: {
    padding: 16,
    gap: 4,
  },
  inputLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
    marginTop: 10,
    marginBottom: 4,
  },
  input: {
    backgroundColor: colors.black,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: colors.textPrimary,
    fontSize: 14,
  },
  formBtns: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  saveBtn: {
    flex: 2,
    paddingVertical: 11,
    borderRadius: 8,
    backgroundColor: colors.textPrimary,
    alignItems: 'center',
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    color: colors.black,
    fontSize: 14,
    fontWeight: '700',
  },
});
