import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class RtttlMelodies {

// Themes and TV
public static rtttl_simpsons           = 'The Simpsons:d=4,o=5,b=160:c.6,e6,f#6,8a6,g.6,e6,c6,8a,8f#,8f#,8f#,2g,8p,8p,8f#,8f#,8f#,8g,a#.,8c6,8c6,8c6,c6';
public static rtttl_topgun             = 'TopGun:d=4,o=4,b=31:32p,16c#,16g#,16g#,32f#,32f,32f#,32f,16d#,16d#,32c#,32d#,16f,32d#,32f,16f#,32f,32c#,16f,d#,16c#,16g#,16g#,32f#,32f,32f#,32f,16d#,16d#,32c#,32d#,16f,32d#,32f,16f#,32f,32c#,g#';
public static rtttl_a_team             = 'A-Team:d=8,o=5,b=125:4d#6,a#,2d#6,16p,g#,4a#,4d#.,p,16g,16a#,d#6,a#,f6,2d#6,16p,c#.6,16c6,16a#,g#.,2a#';
public static rtttl_mission_impossible = 'MissionImp:d=16,o=6,b=95:32d,32d#,32d,32d#,32d,32d#,32d,32d#,32d,32d,32d#,32e,32f,32f#,32g,g,8p,g,8p,a#,p,c7,p,g,8p,g,8p,f,p,f#,p,g,8p,g,8p,a#,p,c7,p,g,8p,g,8p,f,p,f#,p,a#,g,2d,32p,a#,g,2c#,32p,a#,g,2c,a#5,8c,2p,32p,a#5,g5,2f#,32p,a#5,g5,2f,32p,a#5,g5,2e,d#,8d';
public static rtttl_danger_mouse       = 'DangerMo:d=4,o=5,b=355:a.,8g,a,8a,p,8a4,8p,d,p,a.,8g,a,8a,p,8a4,8p,d,p,a,a,a#,a#,a#,a#,a#,a#,a#,c6,2a,p,8a4,8p,d,p,a.,8g,a,8a,p,8a4,8p,d,p,a.,8g,a,8a,p,8a4,8p,d,p,a,a,a#,a#,a#,a#,a#,a#,a#,c6,2d6,p,8a4,8p,d,p,a.,8a,2a#.,8a#4,8p,d#,2p,a#,2a#,2f#,2d#,a#.,8a#,2b.,8b4,8p,e,2p,b,2b,2g,2e,b.,8d6,1e.6,e6,8e6,8e';
public static rtttl_super_man          = 'SuperMan:d=4,o=5,b=180:8g,8g,8g,c6,8c6,2g6,8p,8g6,8a.6,16g6,8f6,1g6,8p,8g,8g,8g,c6,8c6,2g6,8p,8g6,8a.6,16g6,8f6,8a6,2g.6,p,8c6,8c6,8c6,2b.6,g.6,8c6,8c6,8c6,2b.6,g.6,8c6,8c6,8c6,8b6,8a6,8b6,2c7,8c6,8c6,8c6,8c6,8c6,2c.6';
public static rtttl_das_boot           = 'DasBoot:d=4,o=5,b=100:d#.4,8d4,8c4,8d4,8d#4,8g4,a#.4,8a4,8g4,8a4,8a#4,8d,2f.,p,f.4,8e4,8d4,8e4,8f4,8a4,c.,8b4,8a4,8b4,8c,8e,2g.,2p';
public static rtttl_knigh_rider1       = 'KnightRider:d=4,o=5,b=63:16e,32f,32e,8b,16e6,32f6,32e6,8b,16e,32f,32e,16b,16e6,d6,8p,16e,32f,32e,8b,16e6,32f6,32e6,8b,16e,32f,32e,16b,16e6,f6';
public static rtttl_knight_rider2      = 'Kn-Rider:d=4,o=6,b=90:16d.5,32d#.5,32d.5,8a.5,16d.,32d#.,32d.,8a.5,16d.5,32d#.5,32d.5,16a.5,16d.,2c,16d.5,32d#.5,32d.5,8a.5,16d.,32d#.,32d.,8a.5,16d.5,32d#.5,32d.5,16a.5,16d.,2d#,a4,32a#.4,32a.4,d5,32d#.5,32d.5,2a5,16c.,16d.';
public static rtttl_star_wars_imperial = 'Imperial:d=4,o=5,b=112:8g,16p,8g,16p,8g,16p,16d#.,32p,32a#.,8g,16p,16d#.,32p,32a#.,g,8p,32p,8d6,16p,8d6,16p,8d6,16p,16d#.6,32p,32a#.,8f#,16p,16d#.,32p,32a#.,g,8p,32p,8g6,16p,16g.,32p,32g.,8g6,16p,16f#.6,32p,32f.6,32e.6,32d#.6,16e6,8p,16g#,32p,8c#6,16p,16c.6,32p,32b.,32a#.,32a.,16a#,8p,16d#,32p,8f#,16p,16d#.,32p,32g.,8a#,16p,16g.,32p,32a#.,d6,8p,32p,8g6,16p,16g.,32p,32g.,8g6,16p,16f#.6,32p,32f.6,32e.6,32d#.6,16e6,8p,16g#,32p,8c#6,16p,16c.6,32p,32b.,32a#.,32a.,16a#,8p,16d#,32p,8f#,16p,16d#.,32p,32g.,8g,16p,16d#.,32p,32a#.,g';
public static rtttl_star_wars_rebel    = 'St Wars:d=4,o=5,b=180:8f,8f,8f,2a#.,2f.6,8d#6,8d6,8c6,2a#.6,f.6,8d#6,8d6,8c6,2a#.6,f.6,8d#6,8d6,8d#6,2c6,p,8f,8f,8f,2a#.,2f.6,8d#6,8d6,8c6,2a#.6,f.6,8d#6,8d6,8c6,2a#.6,f.6,8d#6,8d6,8d#6,2c6';
public static rtttl_star_wars_end      = 'SW End:d=4,o=5,b=225:2c,1f,2g.,8g#,8a#,1g#,2c.,c,2f.,g,g#,c,8g#.,8c.,8c6,1a#.,2c,2f.,g,g#.,8f,c.6,8g#,1f6,2f,8g#.,8g.,8f,2c6,8c.6,8g#.,8f,2c,8c.,8c.,8c,2f,8f.,8f.,8f,2f';
public static rtttl_star_wars_cantina  = 'Cantina:d=4,o=5,b=250:8a,8p,8d6,8p,8a,8p,8d6,8p,8a,8d6,8p,8a,8p,8g#,a,8a,8g#,8a,g,8f#,8g,8f#,f.,8d.,16p,p.,8a,8p,8d6,8p,8a,8p,8d6,8p,8a,8d6,8p,8a,8p,8g#,8a,8p,8g,8p,g.,8f#,8g,8p,8c6,a#,a,g';
public static rtttl_back_to_the_future = 'BackToTheFuture:d=4,o=6,b=180:2c,8b5,8a5,b5,a5,g5,1a5,p,d,2c,8b5,8a5,b5,a5,g5,1a5';

// Music
public static rtttl_scooter_howmuch    = 'HowMuchI:d=4,o=6,b=125:8g,8g,16f,16e,f,8d.,16c,8d,8g,8g,8f,8e,8g,8g,16f,16e,f,d,8e,8c,2d,8p,8d,8f,8g,a,a,8a_,8g,2a,8g,8g,16f,16e,f,d,8f,8g,8g,8f,8e,8g,8g,16f,16e,f,d,8e,8c,2d';

// Alarm & Siren
public static rtttl_siren  = 'Sirene:d=4,o=6,b=160:2g5,2c,2g5,2c,2g5,2c,2g5,2c,2g5,2c,2g5,2c,2g5,2c,2g5,2c,2g5,2c,2g5,2c,2g5,2c,2g5,2c,2g5,2c,2g5,2c,2g5,2c,2g5,2c,2g5,2c,2g5,2c,2g5,2c,2g5,2c,2g5,2c,2g5,2c,2g5,2c,2g5,2c,2g5,2c,2g5,2c,2g5,2c';
public static rtttl_siren2 = 'PoliceSi:d=4,o=6,b=140:8e,8c,8e,8c,8e,8c,8e,8c,8e,8c,8e,8c,8e,8c,8e,8c,8e,8c,8e,8c,8e,8c,8e,8c';
public static rtttl_siren3 = 'PoliceSi:d=2,o=5,b=160:g,c6,g,c6,g,c6,g,c6,g,c6,g,c6,g,c6,g,c6,g,c6,g,c6,g,c6,g,c6';
public static rtttl_siren4 = 'PoliceAl:d=4,o=6,b=120:a5,f5,a5,f5,a5,f5,a5,f5,a5,f5,a5,f5,a5,f5,a5,f5,a5,f5,a5,f5,a5';
public static rtttl_siren5 = 'Politie:d=4,o=6,b=112:c5,a5,f5,a5,c5,a5,f5,a5,c5,a5,f5,a5,c5,a5,f5,a5,c5,a5,f5,a5,c5,a5,f5,a5,c5,a5,f5,a5,c5,a5';

// Classic ringtones
public static rtttl_death_march = 'Death March:d=4,o=5,b=125:c.,c,8c,c.,d#,8d,d,8c,c,8c,2c.';
public static rtttl_hey_baby    = 'HeyBaby:d=4,o=5,b=900:8a4,16a#4,16b4,16c,16c#,16d,16d#,16e,16f,16f#,16g,16g#,16a,16a#,16b,16c6,8c#6,16d6,16d#6,16e6,16f6,p,p,16a4,16a#4,16b4,16c,16c#,16d,16d#,16e,16f,16f#,16g,16g#,16a,16a#,16b,16a#,16a,16g#,16g,16f#,16f,16e,16d#,16d,16c#,16c,16b4,16a#4,16a4';

// Simple tones
public static rtttl_beep_two_short  = 'two-short:d=4,o=5,b=100:16e6,16e6';
public static rtttl_beep_long       = 'long:d=1,o=5,b=100:e6';
public static rtttl_beep_siren      = 'siren:d=8,o=5,b=100:d,e,d,e,d,e,d,e';
public static rtttl_beep_scale_up   = 'scale_up:d=32,o=5,b=100:c,c#,d#,e,f#,g#,a#,b';
public static rtttl_beep_scale_down = 'scale_up:d=32,o=5,b=100:b,a#,g#,f#,e,d#,c#,c';
public static rtttl_beep_positive   = 'positive:d=4,o=5,b=100:16c#,a';
public static rtttl_beep_negative   = 'negative:d=4,o=5,b=100:16a,c#';

public static MELODIES_MAP = new Map<number, string>([
  [0, 'NO_TONE'],
  [100, RtttlMelodies.rtttl_simpsons],
  [101, RtttlMelodies.rtttl_topgun],
  [102, RtttlMelodies.rtttl_a_team],
  [103, RtttlMelodies.rtttl_mission_impossible],
  [104, RtttlMelodies.rtttl_danger_mouse],
  [105, RtttlMelodies.rtttl_super_man],
  [106, RtttlMelodies.rtttl_das_boot],
  [107, RtttlMelodies.rtttl_knigh_rider1],
  [108, RtttlMelodies.rtttl_knight_rider2],
  [109, RtttlMelodies.rtttl_star_wars_imperial],
  [110, RtttlMelodies.rtttl_star_wars_rebel],
  [111, RtttlMelodies.rtttl_star_wars_end],
  [112, RtttlMelodies.rtttl_star_wars_cantina],
  [113, RtttlMelodies.rtttl_scooter_howmuch],
  [114, RtttlMelodies.rtttl_back_to_the_future],

  [200, RtttlMelodies.rtttl_siren],
  [201, RtttlMelodies.rtttl_siren2],
  [202, RtttlMelodies.rtttl_siren3],
  [203, RtttlMelodies.rtttl_siren4],
  [204, RtttlMelodies.rtttl_siren5],

  [300, RtttlMelodies.rtttl_death_march],
  [301, RtttlMelodies.rtttl_hey_baby],

  [400, RtttlMelodies.rtttl_beep_two_short],
  [401, RtttlMelodies.rtttl_beep_long],
  [402, RtttlMelodies.rtttl_beep_siren],
  [403, RtttlMelodies.rtttl_beep_scale_up],
  [404, RtttlMelodies.rtttl_beep_scale_down],
  [405, RtttlMelodies.rtttl_beep_positive],
  [406, RtttlMelodies.rtttl_beep_negative]
]);
}