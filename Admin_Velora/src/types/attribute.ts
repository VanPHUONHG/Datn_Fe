export interface IAttribute {
  _id?: string; 
  type: "size" | "color"; 
  value: string;
  isDeleted?: boolean; 
  created_at?: Date;
  updated_at?: Date;
}
