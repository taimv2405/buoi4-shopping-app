// Sample data from the assignment, extended with `category` and `description`
// so the list/detail UI can show them. Screens only ever receive `productId`.
export const products = [
  { id: 'P-101', name: 'React Native Handbook', price: 249000, category: 'React Native', description: 'A practical guide to building production-ready cross-platform mobile apps.' },
  { id: 'P-102', name: 'TypeScript in Practice', price: 199000, category: 'TypeScript', description: 'Practical TypeScript patterns for safer application architecture.' },
  { id: 'P-103', name: 'Mobile UI Design', price: 289000, category: 'UI/UX', description: 'Design responsive, accessible and consistent mobile interfaces.' },
  { id: 'P-104', name: 'JavaScript Patterns', price: 219000, category: 'JavaScript', description: 'Reusable patterns for maintainable JavaScript applications.' },
  { id: 'P-105', name: 'Clean Architecture', price: 319000, category: 'Architecture', description: 'Organize complex applications around stable business boundaries.' },
  { id: 'P-106', name: 'API Design Guide', price: 179000, category: 'Backend', description: 'Design clear, consistent and evolvable HTTP APIs for mobile clients.' },
  { id: 'P-107', name: 'React Performance', price: 269000, category: 'Performance', description: 'Measure and fix rendering bottlenecks in React and React Native apps.' },
  { id: 'P-108', name: 'UX for Mobile Apps', price: 229000, category: 'UI/UX', description: 'Craft mobile experiences that feel natural on every platform.' },
  { id: 'P-109', name: 'Testing React Native', price: 259000, category: 'Testing', description: 'Unit, component and end-to-end testing strategies for mobile apps.' },
  { id: 'P-110', name: 'Modern Navigation', price: 189000, category: 'Navigation', description: 'Stacks, tabs, modals and deep links for real-world mobile apps.' },
  { id: 'P-111', name: 'State Management', price: 239000, category: 'State', description: 'Choose the right place for local, global and server state.' },
  { id: 'P-112', name: 'Cross-platform Apps', price: 299000, category: 'Architecture', description: 'Ship one codebase to iOS, Android and the web without compromise.' },
];

export type Product = (typeof products)[number];

export type ProductSource = 'home' | 'search' | 'related';

export function getProduct(id: string | undefined) {
  return products.find((p) => p.id === id);
}

export function getRelatedProductId(id: string) {
  const index = products.findIndex((p) => p.id === id);
  return products[(index + 1) % products.length].id;
}

export function formatPrice(price: number) {
  return `${String(price).replace(/\B(?=(\d{3})+(?!\d))/g, '.')} đ`;
}
