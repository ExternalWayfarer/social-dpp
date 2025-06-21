//import React from "react";
import { User } from "../types/author";

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

export interface DisplayReactionGroup {
  type: string;
  emoji: string;
  count: number;
  //currentUserReacted?: boolean;
};



export interface ReactionProps {
    reaction: Reaction
}

const ReactionVisible = ({ reaction }: ReactionProps) => {
    const { reaction_type_display} = reaction
    return (
        <div>
            {reaction_type_display}
        </div>
    );
};

export default ReactionVisible;