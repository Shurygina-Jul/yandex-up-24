module.exports = function (maps) {
  const pages = [];

  // Функция для определения пересекающихся областей
  function isOverlap(box1, box2) {
    return (
      box1[0] < box2[2] &&
      box1[2] > box2[0] &&
      box1[1] < box2[3] &&
      box1[3] > box2[1]
    );
  }

  // Обработка каждой карты
  for (let i = 0; i < maps.length; i++) {
    const map = maps[i];
    let placed = false;

    // Проверка наложения карт на уже существующие страницы
    for (const page of pages) {
      if (page.indexes.every((index) => isOverlap(map, maps[index]))) {
        page.box = [
          Math.min(page.box[0], map[0]),
          Math.min(page.box[1], map[1]),
          Math.max(page.box[2], map[2]),
          Math.max(page.box[3], map[3]),
        ];
        page.indexes.push(i);
        placed = true;
        break;
      }
    }

    // Создание новой страницы, если карта не помещается на существующие страницы
    if (!placed) {
      pages.push({
        box: [...map],
        indexes: [i],
      });
    }
  }

  return pages;
};
