import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { useCategories } from '../hooks/useCourses';
import { useCourseDetail } from '../hooks/useCourseDetail';
import { useCreateCourse, useUpdateCourse, useSellerCourses } from '../hooks/useSeller';
import { SellerCourseFormScreenProps } from '../types/navigation';
import { colors } from '../config/theme';

export default function SellerCourseFormScreen({ route, navigation }: SellerCourseFormScreenProps) {
  const idCourse = route.params?.idCourse;
  const isEditing = !!idCourse;

  const { data: categoriesData } = useCategories();
  const { data: courseDetail } = useCourseDetail(idCourse ?? 0);
  const { data: sellerData } = useSellerCourses();

  const existingCourse = idCourse
    ? sellerData?.items?.find(c => c.idCourse === idCourse)
    : undefined;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [idCategory, setIdCategory] = useState<number | null>(null);

  useEffect(() => {
    if (existingCourse) {
      setTitle(existingCourse.title);
      setPrice(existingCourse.price.toString());
      setImageUrl(existingCourse.imageUrl ?? '');
      const cat = categoriesData?.find(c => c.name === existingCourse.categoryName);
      if (cat) setIdCategory(cat.idCategory);
    }
    if (courseDetail) {
      setDescription(courseDetail.description);
    }
  }, [existingCourse?.idCourse, courseDetail?.idCourse]);

  const { mutate: createCourse, isPending: creating } = useCreateCourse();
  const { mutate: updateCourse, isPending: updating } = useUpdateCourse(idCourse ?? 0);
  const isPending = creating || updating;

  const handleSubmit = () => {
    if (!title.trim()) { Alert.alert('Error', 'Please enter a course title.'); return; }
    if (!description.trim()) { Alert.alert('Error', 'Please enter a course description.'); return; }
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) { Alert.alert('Error', 'Please enter a valid price.'); return; }
    if (!idCategory) { Alert.alert('Error', 'Please select a category.'); return; }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      price: parsedPrice,
      imageUrl: imageUrl.trim() || undefined,
      idCategory,
    };

    if (isEditing) {
      updateCourse(payload, {
        onSuccess: () => {
          Alert.alert('Success', 'Course updated successfully.');
          navigation.goBack();
        },
        onError: (e) => Alert.alert('Error', (e as Error).message || 'Failed to update the course.'),
      });
    } else {
      createCourse(payload, {
        onSuccess: () => {
          Alert.alert('Success', 'Course created successfully!');
          navigation.navigate('SellerDashboard');
        },
        onError: (e) => Alert.alert('Error', (e as Error).message || 'Failed to create the course.'),
      });
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <AntDesignIcon name="arrowleft" size={20} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>{isEditing ? 'Edit course' : 'New course'}</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Course name..."
            placeholderTextColor={colors.textFaint}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            placeholder="Course description..."
            placeholderTextColor={colors.textFaint}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Price (PLN)</Text>
          <TextInput
            style={styles.input}
            placeholder="np. 49.99"
            placeholderTextColor={colors.textFaint}
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Image URL (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="https://..."
            placeholderTextColor={colors.textFaint}
            value={imageUrl}
            onChangeText={setImageUrl}
            autoCapitalize="none"
            keyboardType="url"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.categoriesGrid}>
            {categoriesData?.map(cat => (
              <TouchableOpacity
                key={cat.idCategory}
                style={[styles.categoryChip, idCategory === cat.idCategory && styles.categoryChipSelected]}
                onPress={() => setIdCategory(cat.idCategory)}
              >
                <Text style={[styles.categoryChipText, idCategory === cat.idCategory && styles.categoryChipTextSelected]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, isPending && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={isPending}
        >
          {isPending
            ? <ActivityIndicator color={colors.black} />
            : <Text style={styles.submitBtnText}>{isEditing ? 'Save changes' : 'Create course'}</Text>
          }
        </TouchableOpacity>
      </View>

      <View style={{ height: 60 }} />
    </ScrollView>
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
    paddingBottom: 20,
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
  screenTitle: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
  },
  form: {
    paddingHorizontal: 20,
    gap: 20,
  },
  field: {
    gap: 8,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: colors.textPrimary,
    fontSize: 15,
  },
  inputMultiline: {
    minHeight: 120,
    paddingTop: 14,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryChipSelected: {
    backgroundColor: colors.white,
    borderColor: colors.white,
  },
  categoryChipText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  categoryChipTextSelected: {
    color: colors.black,
    fontWeight: '700',
  },
  submitBtn: {
    height: 52,
    backgroundColor: colors.white,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitBtnText: {
    color: colors.black,
    fontSize: 16,
    fontWeight: '800',
  },
});
