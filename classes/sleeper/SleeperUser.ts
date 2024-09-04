import { SleeperRoster } from "./SleeperRoster";

export class UserData {
  user_id: string;
  settings?: null;
  metadata: Metadata;
  league_id: string;
  is_owner: boolean;
  is_bot?: boolean | null;
  display_name: string;
  avatar: string;
  roster: SleeperRoster;

  constructor(sleeperUser: SleeperUser, roster: SleeperRoster) {
    this.user_id = sleeperUser.user_id;
    this.settings = sleeperUser.settings;
    this.metadata = sleeperUser.metadata;
    this.league_id = sleeperUser.league_id;
    this.is_owner = sleeperUser.is_owner;
    this.display_name = sleeperUser.display_name;
    this.avatar = sleeperUser.avatar;
    this.roster = roster;
  }
}


export interface SleeperUser {
    user_id: string;
    settings?: null;
    metadata: Metadata;
    league_id: string;
    is_owner: boolean;
    is_bot?: boolean | null;
    display_name: string;
    avatar: string;
  }

  export class BlankUserData implements UserData {
    user_id: string
    settings?: null = null
    metadata: Metadata = new BlankMetadata();
    league_id: string;
    is_owner: boolean = false;
    is_bot?: boolean | null | undefined;
    display_name: string = "Missing Member";
    avatar: string = "https://sleepercdn.com/images/v2/icons/player_default.webp";
    roster: SleeperRoster;


    constructor(rosterId: string, leagueId: string, roster: SleeperRoster) {
      this.user_id = rosterId
      this.league_id = leagueId
      this.roster = roster
    }
  }
  export interface Metadata {
    user_message_pn?: string | null;
    transaction_waiver?: string | null;
    transaction_trade?: string | null;
    transaction_free_agent?: string | null;
    transaction_commissioner?: string | null;
    trade_block_pn?: string | null;
    team_name_update?: string | null;
    player_nickname_update?: string | null;
    player_like_pn?: string | null;
    mention_pn: string;
    mascot_message_emotion_leg_9?: string | null;
    mascot_message?: string | null;
    mascot_item_type_id_leg_9?: string | null;
    mascot_item_type_id_leg_18?: string | null;
    mascot_item_type_id_leg_17?: string | null;
    mascot_item_type_id_leg_16?: string | null;
    mascot_item_type_id_leg_15?: string | null;
    mascot_item_type_id_leg_14?: string | null;
    mascot_item_type_id_leg_13?: string | null;
    mascot_item_type_id_leg_12?: string | null;
    mascot_item_type_id_leg_11?: string | null;
    mascot_item_type_id_leg_10?: string | null;
    join_voice_pn?: string | null;
    archived?: string | null;
    allow_pn: string;
    team_name?: string | null;
    mascot_message_leg_3?: string | null;
    mascot_message_emotion_leg_3?: string | null;
    mascot_item_type_id_leg_8?: string | null;
    mascot_item_type_id_leg_7?: string | null;
    mascot_item_type_id_leg_6?: string | null;
    mascot_item_type_id_leg_5?: string | null;
    mascot_item_type_id_leg_4?: string | null;
    mascot_item_type_id_leg_3?: string | null;
    avatar?: string | null;
    allow_sms?: string | null;
    mascot_message_emotion_leg_6?: string | null;
    mascot_message_emotion_leg_1?: string | null;
    mascot_item_type_id_leg_1?: string | null;
    mascot_item_type_id_leg_2?: string | null;
    show_mascots?: string | null;
  }

  class BlankMetadata implements Metadata {
    user_message_pn?: string | null;
    transaction_waiver?: string | null;
    transaction_trade?: string | null;
    transaction_free_agent?: string | null;
    transaction_commissioner?: string | null;
    trade_block_pn?: string | null;
    team_name_update?: string | null;
    player_nickname_update?: string | null;
    player_like_pn?: string | null;
    mention_pn: string;
    mascot_message_emotion_leg_9?: string | null;
    mascot_message?: string | null;
    mascot_item_type_id_leg_9?: string | null;
    mascot_item_type_id_leg_18?: string | null;
    mascot_item_type_id_leg_17?: string | null;
    mascot_item_type_id_leg_16?: string | null;
    mascot_item_type_id_leg_15?: string | null;
    mascot_item_type_id_leg_14?: string | null;
    mascot_item_type_id_leg_13?: string | null;
    mascot_item_type_id_leg_12?: string | null;
    mascot_item_type_id_leg_11?: string | null;
    mascot_item_type_id_leg_10?: string | null;
    join_voice_pn?: string | null;
    archived?: string | null;
    allow_pn: string;
    team_name?: string | null;
    mascot_message_leg_3?: string | null;
    mascot_message_emotion_leg_3?: string | null;
    mascot_item_type_id_leg_8?: string | null;
    mascot_item_type_id_leg_7?: string | null;
    mascot_item_type_id_leg_6?: string | null;
    mascot_item_type_id_leg_5?: string | null;
    mascot_item_type_id_leg_4?: string | null;
    mascot_item_type_id_leg_3?: string | null;
    avatar?: string | null;
    allow_sms?: string | null;
    mascot_message_emotion_leg_6?: string | null;
    mascot_message_emotion_leg_1?: string | null;
    mascot_item_type_id_leg_1?: string | null;
    mascot_item_type_id_leg_2?: string | null;
    show_mascots?: string | null;

    constructor() {
      this.mention_pn = ""
      this.allow_pn = ""
    }
  }
  