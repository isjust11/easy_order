export interface FoodItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
  category?: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFoodItemDto {
  name: string;
  description: string;
  price: number;
  image?: string;
  category?: string;
  isAvailable: boolean;
}

export interface UpdateFoodItemDto extends Partial<CreateFoodItemDto> {} 