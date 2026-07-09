// The four fixed tabs you want shown, regardless of what's in the DB.
// "matchNames" is how we map a tab to real Category rows by name —
// case-insensitive partial match, so "Breakfast" matches a DB category
// named "Breakfast Items" or "breakfast" equally.
export const MENU_TABS = [
  { key: 'all',       label: 'All',       matchNames: [] as string[] },
  { key: 'breakfast', label: 'Breakfast', matchNames: ['breakfast'] },
  { key: 'lunch',     label: 'Lunch',     matchNames: ['lunch'] },
  { key: 'dinner',    label: 'Dinner',    matchNames: ['dinner'] },
  { key: 'drinks',    label: 'Drinks',    matchNames: ['drink', 'coffee', 'tea', 'beverage'] },
]