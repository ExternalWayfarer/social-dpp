export interface Profile {
  nickname: string | null;
  user_bio?: string; 
  user_avatar?: string; 
}

export interface User {
  id: number;
  //email : string;
  profile: Profile;
}




