export async function getFonts() {
  const [mediumFont, semiBoldFont] = await Promise.all([
    fetch(
      new URL('./assets/fonts/gilroy/Gilroy-Medium.ttf', import.meta.url),
    ).then(res => res.arrayBuffer()),
    fetch(
      new URL('./assets/fonts/gilroy/Gilroy-SemiBold.ttf', import.meta.url),
    ).then(res => res.arrayBuffer()),
  ])

  return [
    {
      name: 'Gilroy',
      data: mediumFont,
      weight: 400 as const,
    },
    {
      name: 'Gilroy',
      data: semiBoldFont,
      weight: 700 as const,
    },
  ]
}
