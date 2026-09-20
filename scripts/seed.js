const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- Actualizando datos oficiales de KOUKOU ---');

  // Actualizar o crear StoreSettings con datos solicitados
  await prisma.storeSettings.upsert({
    where: { id: 'singleton' },
    update: {
      whatsappPhone: '528442924776',
      instagram: 'https://www.instagram.com/koukou.choco.slw?stkn=bzJoNzR2OWMyMzA5',
      facebook: 'https://www.facebook.com/koukouchocolate',
      tiktok: 'https://www.tiktok.com/@koukouchocolate',
      location: 'Saltillo, Coahuila, México',
      schedule: 'Lunes a Domingo: 10:00 - 21:00',
      storeName: 'KOUKOU Chocolatería'
    },
    create: {
      id: 'singleton',
      whatsappPhone: '528442924776',
      instagram: 'https://www.instagram.com/koukou.choco.slw?stkn=bzJoNzR2OWMyMzA5',
      facebook: 'https://www.facebook.com/koukouchocolate',
      tiktok: 'https://www.tiktok.com/@koukouchocolate',
      location: 'Saltillo, Coahuila, México',
      schedule: 'Lunes a Domingo: 10:00 - 21:00',
      storeName: 'KOUKOU Chocolatería',
      currency: 'MXN',
      seoTitle: 'KOUKOU | Chocolatería de Alta Gama & Bonbons en Saltillo',
      seoDescription: 'Chocolates finos, bonbons artesanales rellenos, alfajores y café de especialidad en Saltillo.'
    }
  });

  console.log('--- StoreSettings actualizadas exitosamente: WhatsApp 528442924776, FB & IG ---');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
