export interface User {
  _id?: string;
  email: string;
  fullname: string;
  image: string;
  __v?: number;
}

export interface LocalUserInfoProps {
  username: string;
  usermail: string;
  userImage: string;
  userId: string;
}

export interface UserContextProps {
  userInfo: LocalUserInfoProps;
  updateUserInfo: (info: LocalUserInfoProps) => void;
}
