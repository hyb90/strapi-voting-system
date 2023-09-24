'use strict';
module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    
    // For deleting all entries
    let category=await strapi.db.query("api::category.category").findMany();
    let service=await strapi.db.query("api::service.service").findMany();

    let categories= [
      {
        name: "فئة ١",
        name_en: "category 1",
        publishedAt:Date.now()
      },
      {
        name: "فئة ٢",
        name_en: "category 2",
        publishedAt:Date.now()
      }
    ]
    let services = [
      {
          category: 1,
          name: "خدمة 1",
          name_en: "Service 1",
          icon: "uploads/1.svg",
          publishedAt:Date.now()
      },
      {
          category: 1,
          name: "خدمة 2",
          name_en: "Service 2",
          icon: "uploads/2.svg",
          publishedAt:Date.now()
      },
      {
          category: 1,
          name: "خدمة 3",
          name_en: "Service 3",
          icon: "uploads/3.svg",
          publishedAt:Date.now()
      },
      {
          category: 2,
          name: "خدمة 4",
          name_en: "Service 4",
          icon: "uploads/4.svg",
          publishedAt:Date.now()
      },
      {
          category: 2,
          name: "خدمة 5",
          name_en: "Service 5",
          icon: "uploads/5.svg",
          publishedAt:Date.now()
      },
      {
          category: 2,
          name: "خدمة 6",
          name_en: "Service 6",
          icon: "uploads/6.svg",
          publishedAt:Date.now()
      },
      {
          category: 2,
          name: "خدمة 7",
          name_en: "Service 7",
          icon: "uploads/7.svg",
          publishedAt:Date.now()
      }
  ];
  
  
    // For creating entries
    if(category.length<=0){for (let i = 0; i < categories.length; i++) {
      await strapi.db.query("api::category.category").create({
        data: categories[i],
      });
    }}
    if(service.length<=0){for (let i = 0; i < services.length; i++) {
      await strapi.db.query("api::service.service").create({
        data: services[i],
      });
    }}
  }
};
