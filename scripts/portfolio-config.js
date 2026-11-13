// Paths are relative to index.html. Confirm membership before publishing this index.
window.portfolioConfig = {
  // Project menu thumbnails, keyed by the linked HTML filename.
  projectThumbnails: {
    'RPGStarterTemplate.html': 'img/optimized/RPGProfile.webp',
    'MyVoxelShop.html': 'img/mvsStartCut.jpg',
    'navMesh.html': 'img/optimized/NmDCFar1.webp',
    'proceduralWorld.html': 'img/optimized/WgClose1.webp',
    'theWay.html': 'img/optimized/Tw1.webp',
  },
  reelSelectionConfirmed: false,
  initialChapterCount: 3,
  // null = pending; 0 is a real timestamp, never a placeholder.
  chapters: [
    { id: 'navMesh', tags: ['Unity', 'C#', 'A*'], title: { es: 'Sistema de navegación', en: 'Navigation system' }, image: 'img/optimized/NmDCFar1.webp', startSeconds: 4, href: 'pages/navMesh.html' },
    { id: 'shooterUE', tags: ['UE5', 'C++'], title: { es: 'Prototipo de acción y sigilo', en: 'Stealth and action prototype' }, image: 'img/enemigosUE5.png', startSeconds: 18, href: 'pages/shooterUnreal.html' },
    { id: 'proceduralWorld', tags: ['Unity', 'C#'], title: { es: 'Terreno procedural', en: 'Procedural terrain' }, image: 'img/optimized/WgClose1.webp', startSeconds: 32, href: 'pages/proceduralWorld.html' },
    { id: 'theWay', tags: ['Unity', 'C#'], title: { es: 'The Way', en: 'The Way' }, image: 'img/optimized/Tw1.webp', startSeconds: 44, href: 'pages/theWay.html' },
  ],
  // TODO: Real HTTPS repository URL; link stays hidden while null.
  rpgRepositoryUrl: 'https://github.com/Burmuruk/com.burmuruk.rpg-starter-template',
  myVoxelShopDemoUrl: null // Set the public itch.io demo URL when published.
};
