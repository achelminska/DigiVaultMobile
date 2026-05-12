import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import QueryState from '../components/QueryState';
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
      Alert.alert('Error', 'First name and last name cannot be empty.');
      return;
    }
    updateName.mutate(
      { idUser, firstName: firstName.trim(), lastName: lastName.trim() },
      {
        onSuccess: () => setEditing(null),
        onError: () => Alert.alert('Error', 'Failed to update name.'),
      },
    );
  };

  const handleSaveEmail = () => {
    if (!idUser) return;
    if (!email.trim() || !emailPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    updateEmail.mutate(
      { idUser, email: email.trim(), password: emailPassword },
      {
        onSuccess: () => setEditing(null),
        onError: () => Alert.alert('Error', 'Failed to update email. Please check your password.'),
      },
    );
  };

  const handleSavePassword = () => {
    if (!idUser) return;
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match.');
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
          Alert.alert('Success', 'Password changed successfully.');
        },
        onError: () => Alert.alert('Error', 'Failed to change password. Please check your current password.'),
      },
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <AntDesignIcon name="arrowleft" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Account details</Text>
        <View style={styles.headerSpacer} />
      </View>

      <QueryState isLoading={isLoading} isError={isError} onRetry={refetch} errorMessage="Failed to load profile" />

      {profile && (
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          {/* ── FULL NAME ── */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>Full name</Text>
            {editing !== 'name' && (
              <TouchableOpacity onPress={() => openSection('name')} style={styles.editBtn}>
                <AntDesignIcon name="edit" size={15} color={colors.textSecondary} />
                <Text style={styles.editBtnText}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.card}>
            {editing === 'name' ? (
              <View style={styles.formPad}>
                <Text style={styles.inputLabel}>First name</Text>
                <TextInput
                  style={styles.input}
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="First name"
                  placeholderTextColor={colors.textFaint}
                />
                <Text style={styles.inputLabel}>Last name</Text>
                <TextInput
                  style={styles.input}
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Last name"
                  placeholderTextColor={colors.textFaint}
                />
                <View style={styles.formBtns}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={cancelEdit}>
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.saveBtn, updateName.isPending && styles.saveBtnDisabled]}
                    onPress={handleSaveName}
                    disabled={updateName.isPending}>
                    {updateName.isPending
                      ? <ActivityIndicator size="small" color={colors.black} />
                      : <Text style={styles.saveBtnText}>Save</Text>}
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>First name</Text>
                  <Text style={styles.infoValue}>{profile.firstName}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Last name</Text>
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
                <Text style={styles.editBtnText}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.card}>
            {editing === 'email' ? (
              <View style={styles.formPad}>
                <Text style={styles.inputLabel}>New e-mail</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="E-mail"
                  placeholderTextColor={colors.textFaint}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <Text style={styles.inputLabel}>Current password</Text>
                <TextInput
                  style={styles.input}
                  value={emailPassword}
                  onChangeText={setEmailPassword}
                  placeholder="Password"
                  placeholderTextColor={colors.textFaint}
                  secureTextEntry
                />
                <View style={styles.formBtns}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={cancelEdit}>
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.saveBtn, updateEmail.isPending && styles.saveBtnDisabled]}
                    onPress={handleSaveEmail}
                    disabled={updateEmail.isPending}>
                    {updateEmail.isPending
                      ? <ActivityIndicator size="small" color={colors.black} />
                      : <Text style={styles.saveBtnText}>Save</Text>}
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

          {/* ── PASSWORD ── */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>Password</Text>
            {editing !== 'password' && (
              <TouchableOpacity onPress={() => openSection('password')} style={styles.editBtn}>
                <AntDesignIcon name="edit" size={15} color={colors.textSecondary} />
                <Text style={styles.editBtnText}>Change</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.card}>
            {editing === 'password' ? (
              <View style={styles.formPad}>
                <Text style={styles.inputLabel}>Current password</Text>
                <TextInput
                  style={styles.input}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Current password"
                  placeholderTextColor={colors.textFaint}
                  secureTextEntry
                />
                <Text style={styles.inputLabel}>New password</Text>
                <TextInput
                  style={styles.input}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="New password"
                  placeholderTextColor={colors.textFaint}
                  secureTextEntry
                />
                <Text style={styles.inputLabel}>Confirm new password</Text>
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm new password"
                  placeholderTextColor={colors.textFaint}
                  secureTextEntry
                />
                <View style={styles.formBtns}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={cancelEdit}>
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.saveBtn, updatePassword.isPending && styles.saveBtnDisabled]}
                    onPress={handleSavePassword}
                    disabled={updatePassword.isPending}>
                    {updatePassword.isPending
                      ? <ActivityIndicator size="small" color={colors.black} />
                      : <Text style={styles.saveBtnText}>Save</Text>}
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Password</Text>
                <Text style={styles.infoValue}>••••••••</Text>
              </View>
            )}
          </View>

          {/* ── FINANSE (read-only) ── */}
          <Text style={[styles.sectionLabel, styles.sectionLabelStandalone]}>Finances</Text>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Balance</Text>
              <Text style={styles.infoValue}>{profile.balance.toFixed(2)} PLN</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Total withdrawn</Text>
              <Text style={styles.infoValue}>{profile.totalWithdrawn.toFixed(2)} PLN</Text>
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
    paddingTop: Platform.OS === 'android' ? 20 : 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 16,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSpacer: {
    width: 36,
    height: 36,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
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
