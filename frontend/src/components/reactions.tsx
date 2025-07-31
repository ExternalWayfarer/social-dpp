import { User} from "../types/author";



export interface Reaction {
id: number,
user: User,
reaction_type_display: string,
content_object_str: string,
reaction_type: string,
object_id: number,
time_created_at: string,
content_type: number

};



export const AVAILABLE_REACTIONS = {
  DISLIKE: "👎",
  LIKE: "👍",
  HEART: "❤️",
  LOL: "😂",
  CLOWN: "🤡",
  SHIT: "💩",
  NEUTRAL: "😐",
  TEARS: "😭",
  FEAR: "😱",
  ANGRY: "😡",
  FIRE: "🔥",
};


  //grouped reactions
export interface DisplayReactionGroup {
  type: string;
  emoji: string;
  count: number;
  users: User[];
  //currentUserReacted?: boolean;
};




  

export interface ReactionProps {
    reaction: Reaction
}









