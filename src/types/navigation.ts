import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Notification } from '../api/notificationsApi';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  CourseDetail: { idCourse: number };
  Cart: undefined;
  Orders: undefined;
  OrderDetail: { idOrder: number };
  UserProfile: undefined;
  SellerDashboard: undefined;
  SellerCourseForm: { idCourse?: number } | undefined;
  Notifications: undefined;
  NotificationDetail: { notification: Notification };
};

export type RootTabParamList = {
  Home: undefined;
  Search: { sortBy?: string; idCategory?: number } | undefined;
  'My Vault': undefined;
  Wishlist: undefined;
  Account: undefined;
};

export type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;
export type HomeScreenProps = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;
export type CourseDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'CourseDetail'>;
export type SearchScreenProps = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, 'Search'>,
  NativeStackScreenProps<RootStackParamList>
>;
export type WishlistScreenProps = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, 'Wishlist'>,
  NativeStackScreenProps<RootStackParamList>
>;
export type MyVaultScreenProps = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, 'My Vault'>,
  NativeStackScreenProps<RootStackParamList>
>;
export type CartScreenProps = NativeStackScreenProps<RootStackParamList, 'Cart'>;
export type OrdersScreenProps = NativeStackScreenProps<RootStackParamList, 'Orders'>;
export type OrderDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'OrderDetail'>;
export type UserProfileScreenProps = NativeStackScreenProps<RootStackParamList, 'UserProfile'>;
export type AccountScreenProps = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, 'Account'>,
  NativeStackScreenProps<RootStackParamList>
>;
export type SellerDashboardScreenProps = NativeStackScreenProps<RootStackParamList, 'SellerDashboard'>;
export type SellerCourseFormScreenProps = NativeStackScreenProps<RootStackParamList, 'SellerCourseForm'>;
export type NotificationDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'NotificationDetail'>;

