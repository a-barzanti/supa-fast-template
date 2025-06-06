export interface Item {
  id: string;
  title: string;
  description?: string | null;
  owner_id: string;
}

export interface ItemsResponse {
  data: Item[];
  count: number;
}
