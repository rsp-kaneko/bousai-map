/**
 * 共通の基本データ
 */
export interface P2pBasicData {
  id: string;
  code: number;
  time: string; // 形式: "YYYY/MM/DD HH:mm:ss.SSS"
}

// --------------------------------------------------
// 1. 地震情報 (code: 551)
// --------------------------------------------------
export type JmaQuakeType =
  | 'ScalePrompt'        // 震度速報
  | 'Destination'        // 震源に関する情報
  | 'ScaleAndDestination'// 震度・震源に関する情報
  | 'DetailScale'        // 各地の震度に関する情報
  | 'Foreign'            // 遠地地震に関する情報
  | 'Other';             // その他

export type JmaScale = -1 | 10 | 20 | 30 | 40 | 45 | 46 | 50 | 55 | 60 | 70;
// ※ 10: 震度1, 20: 震度2, 30: 震度3, 40: 震度4, 45: 震度5弱, 46: 震度5弱以上(推定), 50: 震度5強, 55: 震度6弱, 60: 震度6強, 70: 震度7, -1: 震度情報なし

export type DomesticTsunamiType =
  | 'None'         // なし
  | 'Unknown'      // 不明
  | 'Checking'     // 調査中
  | 'NonEffective' // 若干の海面変動（被害の心配なし）
  | 'Watch'        // 津波注意報
  | 'Warning';     // 津波予報(警報等)

export interface JmaQuakeIssue {
  source?: string;
  time: string;
  type: JmaQuakeType;
  correct?: 'None' | 'Unknown' | 'ScaleOnly' | 'DestinationOnly' | 'ScaleAndDestination';
}

export interface JmaHypocenter {
  name: string;
  latitude: number;   // 存在しない場合は -200
  longitude: number;  // 存在しない場合は -200
  depth: number;      // km。「ごく浅い」は0、不明時は -1
  magnitude: number;  // 不明時は -1
}

export interface JmaEarthquake {
  time: string;
  hypocenter?: JmaHypocenter;
  maxScale: JmaScale;
  domesticTsunami?: DomesticTsunamiType;
  foreignTsunami?: string;
}

export interface JmaObservationPoint {
  pref: string;      // 都道府県名 (例: "熊本県")
  addr: string;      // 観測点または区域名 (例: "八代市新地町")
  isArea: boolean;   // 区域名かどうか
  scale: JmaScale;   // 観測震度
}

export interface JmaQuake extends P2pBasicData {
  code: 551;
  issue: JmaQuakeIssue;
  earthquake: JmaEarthquake;
  points?: JmaObservationPoint[];
  comments?: {
    freeFormComment?: string;
  };
}

// --------------------------------------------------
// 2. 津波予報 (code: 552)
// --------------------------------------------------
export interface JmaTsunamiArea {
  grade?: 'MajorWarning' | 'Warning' | 'Watch' | 'Unknown';
  immediate?: boolean;
  name: string;
  firstHeight?: {
    arrivalTime?: string;
    condition?: string;
  };
  maxHeight?: {
    description?: string;
    value?: number;
  };
}

export interface JmaTsunami extends P2pBasicData {
  code: 552;
  cancelled: boolean;
  issue: {
    source: string;
    time: string;
    type: 'Focus';
  };
  areas?: JmaTsunamiArea[];
}

// --------------------------------------------------
// 3. 緊急地震速報 検出 (code: 554)
// --------------------------------------------------
export interface EEWDetection extends P2pBasicData {
  code: 554;
  type: 'Full' | 'Chime';
}

// --------------------------------------------------
// 4. 各地域ピア数 (code: 555)
// --------------------------------------------------
export interface Areapeers extends P2pBasicData {
  code: 555;
  areas: Array<{
    id: number;
    peer: number;
  }>;
}

// --------------------------------------------------
// 5. 緊急地震速報 警報 (code: 556)
// --------------------------------------------------
export interface EEW extends P2pBasicData {
  code: 556;
  test?: boolean;
  cancelled: boolean;
  issue: {
    time: string;
    eventId: string;
    serial: string;
  };
  earthquake?: {
    originTime: string;
    arrivalTime: string;
    condition?: string;
    hypocenter?: {
      name: string;
      reduceName: string;
      latitude: number;
      longitude: number;
      depth: number;
      magnitude: number;
    };
  };
  areas?: Array<{
    pref: string;
    name: string;
    scaleFrom: number;
    scaleTo: number;
    kindCode: string;
    arrivalTime?: string | null;
  }>;
}

// --------------------------------------------------
// 6. 地震感知情報 / 解析結果 (code: 561 / 9611)
// --------------------------------------------------
export interface Userquake extends P2pBasicData {
  code: 561;
  area: number;
}

export interface UserquakeEvaluation extends P2pBasicData {
  code: 9611;
  count: number;
  confidence: number;
  started_at?: string;
  updated_at?: string;
  area_confidences?: Record<string, {
    confidence: number;
    count: number;
    display?: string;
  }>;
}

// --------------------------------------------------
// レスポンス全体の型 (Union型)
// --------------------------------------------------
export type P2pHistoryItem =
  | JmaQuake
  | JmaTsunami
  | EEWDetection
  | Areapeers
  | EEW
  | Userquake
  | UserquakeEvaluation;

export type P2pHistoryResponse = P2pHistoryItem[];
