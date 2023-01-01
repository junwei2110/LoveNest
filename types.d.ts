export type LoginStackParamList = {
    Login: undefined;
    SignUp: undefined; 
    ResetPassword: undefined;
  };

export type User = Parse.Attributes|null;

export type UserStackParamList = {
  Home: undefined;
  Stories: undefined; 
  MediaSearch: undefined;
  DatePlanner: undefined;
};

export type UserOverallStackParamList = {
  UserProfile: undefined;
  UserApp: undefined;
  SetUpProfile: undefined;
  PhotoModal: undefined;
  PhotoTaken: undefined;
};

export type OverallParamList = UserOverallStackParamList & UserStackParamList & LoginStackParamList;