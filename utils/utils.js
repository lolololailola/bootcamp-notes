export const generateId = (array) => {
  const maxId = array.length > 0 ? Math.max(...array.map((a) => a.id)) : 0

  return maxId + 1
}
