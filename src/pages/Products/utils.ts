import { type VariationType, type TypeVariationViewType } from '~/models/variations'

export const groupTypeVariations = (data: VariationType[]): TypeVariationViewType[] => {
  const map = new Map<string, TypeVariationViewType>()

  for (const item of data) {
    const key = item.typeVariation.uuid ?? JSON.stringify(item.typeVariation)
    const existing = map.get(key)

    if (existing) {
      existing.variations.push(item)
    } else {
      map.set(key, {
        typeVariation: item.typeVariation,
        variations: [item]
      })
    }
  }

  return Array.from(map.values())
}

export const ungroupTypeVariations = (data: TypeVariationViewType[]): VariationType[] => {
  return data.flatMap(({ typeVariation, variations }) => variations.map(variation => ({ ...variation, typeVariation })))
}
