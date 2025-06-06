import { AppCategoryCode } from "@/constants";


export const getFeatureType = () => {
    const keys = Object.keys(AppCategoryCode);
    const featureTypeKey = keys[0];
    return featureTypeKey;
}
