// Paths are relative to index.html. Confirm membership before publishing this index.
window.portfolioConfig = {
  reelSelectionConfirmed: false,
  initialChapterCount: 3,
  // null = pending; 0 is a real timestamp, never a placeholder.
  chapters: [
    { id: 'navMesh', tags: ['Unity', 'C#', 'A*'], title: { es: 'Sistema de navegación', en: 'Navigation system' }, image: 'img/optimized/NmDCFar1.webp', startSeconds: 4, href: 'pages/navMesh.html' },
    { id: 'shooterUE', tags: ['Unreal Engine 5'], title: { es: 'Shooter UE5', en: 'Shooter UE5' }, image: 'img/optimized/NmDCFar1.webp', startSeconds: 18, href: 'pages/navMesh.html' },
    { id: 'proceduralWorld', tags: ['Unity', 'C#'], title: { es: 'Terreno procedural', en: 'Procedural terrain' }, image: 'img/optimized/WgClose1.webp', startSeconds: 32, href: 'pages/proceduralWorld.html' },
    { id: 'theWay', tags: ['Unity', 'C#'], title: { es: 'The Way', en: 'The Way' }, image: 'img/optimized/Tw1.webp', startSeconds: 44, href: 'pages/theWay.html' }
  ],
  // TODO: Real HTTPS repository URL; link stays hidden while null.
  rpgRepositoryUrl: 'https://github.com/Burmuruk/com.burmuruk.rpg-starter-template',
  myVoxelShopDemoUrl: null // Set the public itch.io demo URL when published.
};
