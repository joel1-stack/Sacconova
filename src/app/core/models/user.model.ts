export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  memberNumber: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  MEMBER = 'member',
  STAFF = 'staff'
}

export interface UserProfile extends User {
  address: string;
  dateOfBirth: Date;
  nationalId: string;
  nextOfKin: string;
  nextOfKinPhone: string;
}