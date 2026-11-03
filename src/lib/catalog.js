import { products as catalogueProducts, categories } from '../../products';

export const PRODUCTS = catalogueProducts.map((product, index) => ({
  ...product,
  label: index < 10 ? 'Study favourite' : 'Everyday essential',
  color: ['#FFF0F6', '#EEE9FF', '#E8F4FF', '#E8F7EF'][index % 4],
  desc: product.description,
  image: null,
}));

export const CATEGORIES = categories;

export const PRICE_RANGES = ['Any price', 'Under Rs 150', 'Rs 150–250', 'Over Rs 250'];
