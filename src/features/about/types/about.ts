export interface PlatformStatItem {
  value: string;
  label: string;
  description: string;
}

export interface CoreValueItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface LeadershipMember {
  id: string;
  name: string;
  role: string;
  bmdcOrTitle: string;
  bio: string;
  imageUrl: string;
}
