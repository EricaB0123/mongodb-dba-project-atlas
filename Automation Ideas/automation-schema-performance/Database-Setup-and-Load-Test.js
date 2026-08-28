//created a test database called 'ingestionDB'.
use('ingestionDB');

//Created the Collections -  assets, metadata, tags, categories, assetTagMap, assetCategoryMap


// --- Assets ---
db.assets.insertMany([
  {
    _id: "asset123",
    name: "Image001.png",
    metadataId: "meta789",
    createdAt: ISODate("2026-08-28T10:00:00Z")
  },
  {
    _id: "asset456",
    name: "Image002.png",
    metadataId: "meta999",
    createdAt: ISODate("2026-08-28T11:00:00Z")
  }
]);

// --- Metadata ---
db.metadata.insertMany([
  {
    _id: "meta789",
    resolution: "1920x1080",
    colorSpace: "sRGB",
    camera: "Canon R6"
  },
  {
    _id: "meta999",
    resolution: "3840x2160",
    colorSpace: "AdobeRGB",
    camera: "Sony A7 IV"
  }
]);

// --- Tags ---
db.tags.insertMany([
  { _id: "t1", name: "portrait" },
  { _id: "t2", name: "raw" },
  { _id: "t3", name: "edited" }
]);

// --- Categories ---
db.categories.insertMany([
  { _id: "c1", name: "photography" },
  { _id: "c2", name: "assets" }
]);

// --- N:M Join Table: assetTagMap ---
db.assetTagMap.insertMany([
  { assetId: "asset123", tagId: "t1" },
  { assetId: "asset123", tagId: "t2" },
  { assetId: "asset123", tagId: "t3" },

  { assetId: "asset456", tagId: "t1" },
  { assetId: "asset456", tagId: "t3" }
]);

// --- N:M Join Table: assetCategoryMap ---
db.assetCategoryMap.insertMany([
  { assetId: "asset123", categoryId: "c1" },
  { assetId: "asset456", categoryId: "c2" }
]);

print("Over-normalized dataset seeded successfully.");
