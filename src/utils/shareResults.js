export const encodeResults = (answers, result) => {
  try {
    const data = JSON.stringify({ a: answers, r: result })
    return btoa(encodeURIComponent(data))
  } catch {
    return null
  }
}

export const decodeResults = (encoded) => {
  try {
    const json = decodeURIComponent(atob(encoded))
    return JSON.parse(json)
  } catch {
    return null
  }
}
