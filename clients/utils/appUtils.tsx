import { AppCategoryCode } from "@/constants";
import { Feature } from "@/types/feature";


export const getFeatureType = () => {
    const keys = Object.keys(AppCategoryCode);
    const featureTypeKey = keys[0];
    return featureTypeKey;
}


 export const buildFeature = (items: Feature[]): Feature[] => {
    // Tạo một bản đồ để dễ dàng truy cập các nút theo id
    const itemMap: Record<string, Feature> = {};
    items.forEach(item => {
      itemMap[item.id] = { ...item, children: [] };
    });

    // Xây dựng cây
    const tree: Feature[] = [];

    items.forEach(item => {
      if (item.parentId) {
        // Nếu có parentId, thêm vào children của parent
        if (itemMap[item.parentId]) {
          itemMap[item.parentId].children?.push(itemMap[item.id]);
          // Sắp xếp children theo order
          itemMap[item.parentId].children?.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        }
      } else {
        // Nếu không có parentId, thêm vào cây gốc
        tree.push(itemMap[item.id]);
      }
    });

    // Sắp xếp cây gốc theo order
    tree.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    return tree;
  }