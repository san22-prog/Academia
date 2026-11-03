export function filterProducts(products, { category, search, priceRange }) {
  return products.filter((product) => {
    const matchesCategory = category === 'All Products' || product.category === category;
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || `${product.name} ${product.category}`.toLowerCase().includes(q);

    let matchesPrice = true;

    if (priceRange === 'Under Rs 150') {
      matchesPrice = product.price < 150;
    }

    if (priceRange === 'Rs 150–250') {
      matchesPrice = product.price >= 150 && product.price <= 250;
    }

    if (priceRange === 'Over Rs 250') {
      matchesPrice = product.price > 250;
    }

    return matchesCategory && matchesSearch && matchesPrice;
  });
}
