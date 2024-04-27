import { db } from '../src/db'

const categories = [
  {
    name: 'category1',
  },
  {
    name: 'category2',
  },
  {
    name: 'category3',
  },
  {
    name: 'category4',
  },
]

async function main() {
  await db.category.createMany({
    data: categories,
  })

  await db.size.createMany({
    data: [
      {
        size: 'L',
      },
      {
        size: 'SM',
      },
      {
        size: 'XL',
      },
      {
        size: 'XS',
      },
      {
        size: 'XXL',
      },
      {
        size: 'XXS',
      },
    ],
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
