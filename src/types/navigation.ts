import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  CourseDetail: { idCourse: number };
};

export type RootTabParamList = {
  Home: undefined;
  Search: { sortBy?: string; idCategory?: number } | undefined;
  'My Vault': undefined;
  Wishlist: undefined;
  Account: undefined;
};

export type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;
export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type CourseDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'CourseDetail'>;
export type SearchScreenProps = BottomTabScreenProps<RootTabParamList, 'Search'>;
